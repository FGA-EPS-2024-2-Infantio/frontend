"use client"

import { createAttendance, fetchAttendanceByDate, fetchAttendanceById, updateAttendance } from "@/store/slices/attendanceSlice";
import { fetchStudents } from "@/store/slices/studentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreateAttendanceType } from "@/types/Attendances";
import { TableProps, Checkbox, Spin, FormProps, Form, DatePicker, Divider, Table, Button, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
    const {classId,attendanceDate,attendanceId} = useParams();
    const [studentList, setStudentList] = useState<CreateAttendanceType[]>([])
    const classIdStr = Array.isArray(classId) ? classId[0] : classId
    

    

    const dispatch = useDispatch<AppDispatch>()

    const { loading, error, classObj } = useSelector(
        (state: RootState) => state.class
      )
      const attendancesByDate = useSelector((state: RootState) => state.attendence.attendancesByDate);
      const attendancesByDateError = useSelector((state: RootState) => state.attendence.error);

      useEffect(() => {
        dispatch(fetchStudents())
        const students: CreateAttendanceType[] = []
        classObj?.students.forEach(student => students.push({studentId: student.id, classId: classIdStr, date: new Date(), hasAttended: false}))
        setStudentList(students)
      }, [dispatch])
    
      useEffect(() => {

        const decodedDate = decodeURIComponent(attendanceDate || '');
          console.log('Fetching attendance by date:', decodedDate); 
          dispatch(fetchAttendanceByDate(decodedDate));
        
      }, [dispatch]); 
   

      useEffect(()=>{
        console.log("isso",attendancesByDate)

      },[])
      
      const handleChange = (event: CheckboxChangeEvent) => {
        const isChecked = event.target.checked;
        const studentIndex = studentList.findIndex(student => student.studentId === event.target.id);
        studentList[studentIndex].hasAttended = isChecked;
      }

      type DataType = {
        studentId: string,
        studentName:string,
      }

      const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Nome do Aluno',
          dataIndex: 'studentName',
          key: 'name',
          render: text => <strong>{text}</strong>
        },
        {
            title: "Presente",
            key: "attendance",
            render: (_, record) => <Checkbox id={record.studentId} defaultChecked={attendancesByDate.find(attendance => attendance.studentId === record.studentId)?.hasAttended as boolean} onChange={handleChange} />,
        },
      ]

      if(!classObj) {
        return <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
      }
    
      const data: DataType[] = classObj?.students.map(student => ({
        studentId: student.id,
        studentName: student.name,
      }))

      type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
      };
      
      const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success: ', values, studentList);
        studentList.forEach((student) => {
          
          console.log("id chamda",attendanceId);
          if(!attendanceId) return;
          dispatch(updateAttendance({id: attendanceId, data: student}))
        })
      };
      
      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
       <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
    Chamada do dia {new Date(decodeURIComponent(attendanceDate)).toLocaleDateString('pt-BR')}
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
};

export default Page