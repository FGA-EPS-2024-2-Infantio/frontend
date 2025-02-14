"use client";

import { createAttendance } from "@/store/slices/attendanceSlice";
import { fetchStudents } from "@/store/slices/studentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreateAttendanceType } from "@/types/Attendances";
import { Button, Checkbox, DatePicker, Divider, Form, FormProps, Spin, Table, TableProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Page = () => {
  const { classId } = useParams();
  const [studentList, setStudentList] = useState<CreateAttendanceType[]>([])
  const classIdStr = Array.isArray(classId) ? classId[0] : classId

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();
  const session = useSession();


  const handleDateChange = (date: Date) => {

    const selectedDate = new Date(date.valueOf());

    setSelectedDate(selectedDate);
  };

  const dispatch = useDispatch<AppDispatch>()

  const { classObj } = useSelector(
    (state: RootState) => state.class
  )

  useEffect(() => {
    dispatch(fetchStudents(session.data?.user.id ?? ""))
    const students: CreateAttendanceType[] = []
    classObj?.students.forEach(student => students.push({ studentId: student.id, classId: classIdStr, date: new Date(), hasAttended: false, entryTime: null, exitTime: null }))
    setStudentList(students)
  }, [dispatch, session.data?.user.id])

  const handleChange = (event: CheckboxChangeEvent) => {
    const isChecked = event.target.checked;
    const studentIndex = studentList.findIndex(student => student.studentId === event.target.id);
    studentList[studentIndex].hasAttended = isChecked;
  }

  const handleGeneratePDF = () => {
    if (!classObj) {
      toast.error("Informações da turma não estão carregadas!");
      return;
    }
  
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(0, 0, 0);
  
    doc.setFontSize(18);
    doc.text("Lista de Presença", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.text(`Turma: ${classObj.name}`, 10, 30);
    doc.text(`Professor: ${classObj.teacher.name}`, 10, 40);
    doc.text(`Data: ${selectedDate.toLocaleDateString("pt-BR")}`, 10, 50);
  
    doc.line(10, 55, 200, 55);
  
    const tableData = classObj.students.map((student, index) => [
      index + 1,
      student.name,
      "[    ]",
    ]);
  
    autoTable(doc, {
      startY: 60,
      head: [["Nº", "Nome do Aluno", "Presença"]],
      body: tableData,
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      styles: {
        font: "Helvetica",
        fontSize: 10,
      },
    });

    doc.save(`chamada_turma_${classObj.name}.pdf`);
  };

  type DataType = {
    studentId: string,
    studentName: string,
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
      render: (_, record) => <Checkbox id={record.studentId} onChange={handleChange} />,
    },
  ]

  if (!classObj) {
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

  const onFinish: FormProps<FieldType>['onFinish'] = async () => {
    const updatedStudentList = studentList.map(student => ({
      ...student,
      date: selectedDate,
    }));

    console.log("lista", updatedStudentList)

    await dispatch(createAttendance(updatedStudentList)).unwrap()
    .then(() => {
      toast.success('Chamada criada com sucesso')
      router.push(`/turmas/${classId}`);
    })
    .catch();
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
    <Form.Item<Date>
      label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Escolha a data</span>}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <DatePicker onChange={handleDateChange} 
        style={{ width: '30%', height: '40px', fontSize: '20px' }}/>

        <Button type="primary" htmlType="submit" 
        onClick={handleGeneratePDF}> Gerar PDF </Button>
      </div>
    </Form.Item>

    <Divider />
    <Table<DataType>
      columns={columns}
      dataSource={data}
    />
    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
       Salvar chamada 
      </Button>
    </Form.Item>
  </Form>
};

export default Page;