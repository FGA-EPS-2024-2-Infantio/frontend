"use client"

import { fetchAttendanceByDateAndClass, updateAttendance } from "@/store/slices/attendanceSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreateAttendanceType } from "@/types/Attendances";
import { Button, Checkbox, Divider, Form, FormProps, Spin, Table, TableProps, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = ({params}: {params: {classId: string, attendanceDate: string, attendanceId: string}}) => {
  const { classId, attendanceDate } = useParams();
  const [studentList, setStudentList] = useState<CreateAttendanceType[]>([]);

  // const classIdStr = Array.isArray(classId) ? classId[0] : classId; // Comentado para ser der merda.
  const dispatch = useDispatch<AppDispatch>();

  const { classObj } = useSelector((state: RootState) => state.class);
  const attendancesByDate = useSelector((state: RootState) => state.attendence.attendancesByDate);

  const router = useRouter();
  
  useEffect(() => {
    if (attendanceDate && classId) {
      const decodedDate = decodeURIComponent(params.attendanceDate);
      console.log("decoded", decodedDate);
      console.log("id", classId);
      dispatch(fetchAttendanceByDateAndClass({ date: decodedDate, classId: params.classId }));
    }
  }, [dispatch, attendanceDate, classId, params.attendanceDate, params.classId]);

  useEffect(() => {
    // Atualizar lista de alunos quando a lista de estudantes ou presenças mudar
    if (classObj?.students && attendancesByDate) {
      const formattedDate = attendanceDate ? new Date(decodeURIComponent(params.attendanceDate)).toISOString() : '';
      
      const updatedStudentList: CreateAttendanceType[] = classObj.students.map(student => {
        const attendance = attendancesByDate.find(
          (attendance) => attendance.studentId === student.id
        );
        
        return {
          studentId: student.id,
          classId: params.classId,
          date: formattedDate ? new Date(formattedDate) : new Date(),
          hasAttended: attendance ? attendance.hasAttended : false,
        };
      });
      
      setStudentList(updatedStudentList);
    }
  }, [classObj, attendancesByDate, attendanceDate]);

  const handleChange = (event: CheckboxChangeEvent) => {
    const isChecked = event.target.checked;
    const studentIndex = studentList.findIndex(student => student.studentId === event.target.id);
    
    if (studentIndex === -1) return; // Garantir que o índice do aluno seja válido
    
    // Atualizar de forma imutável
    const updatedStudentList = studentList.map((student, index) => {
      if (index === studentIndex) {
        return { ...student, hasAttended: isChecked };
      }
      return student;
    });

    setStudentList(updatedStudentList);
  };

  type DataType = {
    studentId: string;
    studentName: string;
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'studentName',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: "Presente",
      key: "attendance",
      render: (_, record) => (
        <Checkbox 
          id={record.studentId} 
          checked={studentList.find(attendance => attendance.studentId === record.studentId)?.hasAttended || false} 
          onChange={handleChange}
        />
      ),
    },
  ];

  if (!classObj) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  const data: DataType[] = classObj.students.map(student => ({
    studentId: student.id,
    studentName: student.name,
  }));

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async () => {
    console.log('Success: ', studentList);
    dispatch(updateAttendance({ data: studentList })).unwrap()
    .then(() => {
      toast.success('Alterações salvas com sucesso')
      router.back();
    })
    .catch();;
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Lista de Chamada
      </Typography.Title>

      <Divider />
      <Table<DataType>
        columns={columns}
        dataSource={data}
      />
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Page;
