'use client'


import { MonthlyPaymentResponseDto } from '@/types/Payment'
import { Button, Table, TableProps } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'
import ModalCreatePayment from './ModalCreatePayment'
import { fetchDownloadCsv } from '@/store/slices/paymentSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { toast } from 'react-toastify'

type Props = {
  loading: boolean
  payments: MonthlyPaymentResponseDto[]
  studentId: string
}

export default function MonthlyPayment({
  loading,
  payments,
  studentId
}: Readonly<Props>) {

  const dispatch = useDispatch<AppDispatch>();

    const columns: TableProps<MonthlyPaymentResponseDto>['columns'] = [
        {
            title: 'Ano',
            dataIndex: 'year',
            key: 'year',
            render: text => <strong>{text}</strong>,
            sorter: (a, b) => a.year - b.year
        },
        {
            title: 'Mês de referência',
            dataIndex: 'month',
            key: 'month'
        },
        {
            title: 'Pagamento',
            dataIndex: 'payed',
            key: 'payed',
            render: payed => <strong>{payed ? 'Pago' : 'Não Pago'}</strong>,
            sorter: (a, b) => Number(a.payed) - Number(b.payed)
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => a.value - b.value
        }
    ]
  
  const downloadCsv = async () => {
    const action = await dispatch(fetchDownloadCsv(studentId));

    if (fetchDownloadCsv.rejected.match(action)) {
      toast.error(`Erro ao realizar o download`)
    } else {
      const blob = new Blob([action.payload], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      toast.success(`Download realizado com sucesso`)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [payment, setPayment] = useState<MonthlyPaymentResponseDto>()
  
  const handleRowClick = (record: MonthlyPaymentResponseDto) => {
    setPayment(record)
    setIsModalOpen(true)
  }

    return (
        <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Gerenciamento de Pagamentos</h2>
                <div>
                  <Button className='mr-2' type='primary' onClick={() => setIsModalOpen(true)}>
                      Adicionar Pagamento
                  </Button>
                  <Button disabled={payments.length == 0} type='primary' onClick={() => downloadCsv()}>
                      Exportar planilha
                  </Button>
                </div>
            </div>
            <Table<MonthlyPaymentResponseDto>
                columns={columns}
                dataSource={payments}
                pagination={false}
                rowHoverable={false}
                bordered
                loading={loading}
                onRow={record => ({
                    onClick: () => handleRowClick(record)
                  })}
                rowClassName={({ disabled }) =>
                    classNames(
                      'cursor-pointer hover:bg-gray-100 transition duration-200',
                      {
                        'bg-red-100 hover:!bg-red-200': disabled
                      }
                    )
                  }
            />


            <ModalCreatePayment
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                studentId={studentId}
                monthlyPaymentToEdit={payment}
                setPayment={setPayment}
            />
        </div>
    )
}
