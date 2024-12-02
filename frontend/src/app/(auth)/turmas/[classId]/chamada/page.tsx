"use client"

import { createAttendance } from "@/store/slices/attendanceSlice";
import { fetchStudents } from "@/store/slices/studentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreateAttendanceType } from "@/types/Attendances";
import { StudentsResponseDTO } from "@/types/Students";
import { Button, Checkbox, DatePicker, Divider, Form, FormProps, Radio, Spin, Table, TableColumnsType, TableProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";  

const Page = () => {
    const {classId} = useParams();
    const [studentList, setStudentList] = useState<CreateAttendanceType[]>([])
    const classIdStr = Array.isArray(classId) ? classId[0] : classId

    

    const dispatch = useDispatch<AppDispatch>()

    const { loading, error, classObj } = useSelector(
        (state: RootState) => state.class
      )
    
      useEffect(() => {
        dispatch(fetchStudents())
        const students: CreateAttendanceType[] = []
        classObj?.students.forEach(student => students.push({studentId: student.id, classId: classIdStr, date: new Date(), hasAttended: false}))
        setStudentList(students)
      }, [dispatch])

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
            render: (_, record) => <Checkbox id={record.studentId} onChange={handleChange} />,
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
        await dispatch(createAttendance(studentList));
      };
      
      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item<Date> label="Attendance date"><DatePicker></DatePicker></Form.Item>
        
      <Divider />
      <Table<DataType>
        columns={columns}
        dataSource={data}
      />
      <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
    </Form>
};

export default Page;