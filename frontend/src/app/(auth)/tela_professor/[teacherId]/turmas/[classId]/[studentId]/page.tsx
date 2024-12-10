'use client'
import ModalCreateStudent from '@/components/Student/ModalCreateStudent'
import { deleteStudentById, fetchStudentById } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Spin } from 'antd'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function ProfessorStudentDetails() {
  const { studentId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, student } = useSelector(
    (state: RootState) => state.student
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const studentIdStr = Array.isArray(studentId) ? studentId[0] : studentId

  useEffect(() => {
    if (studentIdStr) {
      dispatch(fetchStudentById(studentIdStr))
    }
  }, [dispatch, studentIdStr])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const copyToClipboard = () => {
    // TODO recuperar link de cadastro do aluno

    navigator.clipboard.writeText('LINK CADASTRO ALUNO')
    toast.info('Link Copiado com Sucesso')
  }

  const handleDeactivateStudent = useCallback(() => {
    dispatch(deleteStudentById(studentIdStr))
      .unwrap()
      .then(() => {
        toast.success('Aluno desativado com sucesso')
        dispatch(fetchStudentById(studentIdStr))
      })
      .catch(error => toast.error(`Erro: ${error.message}`))
  }, [dispatch, studentIdStr])

  const actionMenuItems = useMemo(() => {
    const items = []

    items.push({
      key: 'editStudent',
      label: <span onClick={() => setIsModalOpen(true)}>Editar Estudante</span>
    })

    if (!student?.disabled) {
      items.push({
        key: 'deactivateStudent',
        label: (
          <Popconfirm
            title='Tem certeza que deseja desativar este Estudante?'
            onConfirm={handleDeactivateStudent}
            okText='Sim'
            cancelText='Não'
            placement='bottom'
          >
            <span>Desativar Estudante</span>
          </Popconfirm>
        )
      })
    }

    items.push({
      key: 'copyToClipboard',
      label: <span onClick={copyToClipboard}>Copiar link</span>
    })

    return items
  }, [handleDeactivateStudent, student?.disabled])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spin size='large' />
      </div>
    )
  if (!student)
    return (
      <div className='flex h-full items-center justify-center'>
        Estudante não encontrado
      </div>
    )

  return (
    <div className='mx-6 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{student.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>
      <p>
        {student.disabled ? (
          <p className='text-red-500'>Desabilitada</p>
        ) : (
          <p className='text-green-500'>Habilitada</p>
        )}
      </p>
      <h1>Dados do Aluno</h1>
      <div className='border'>
        <p className='text-gray-700'>Nome do aluno: {student.name} </p>
        <div className="">
          <p className='text-gray-700'>Data de Nascimento: {student.dataNascimento}</p>
          <p className='text-gray-700'>Naturalidade: {student.naturalidadeAluno}</p>
          <p className='text-gray-700'>Endereço: {student.endereco}</p>
          <p className='text-gray-700'>CEP: {student.cep}</p>
        </div>
        <div className=''>
          <h4> Dados da Mãe </h4>
          <p className='text-gray-700'>Data de Nascimento: {student.mae.name}</p>
          <p className='text-gray-700'>Tel.: {student.mae.phone}</p>
          <p className='text-gray-700'>Endereço: {student.mae.rg}</p>
          <p className='text-gray-700'>CPF: {student.mae.cpf}</p>
          <p className='text-gray-700'>Naturalidade: {student.mae.naturalidade}</p>
        </div>
        <div className=''>
          <h4> Dados do Pai </h4>
          <p className='text-gray-700'>Data de Nascimento: {student.pai.name}</p>
          <p className='text-gray-700'>Tel.: {student.pai.phone}</p>
          <p className='text-gray-700'>Endereço: {student.pai.rg}</p>
          <p className='text-gray-700'>CPF: {student.pai.cpf}</p>
          <p className='text-gray-700'>Naturalidade: {student.pai.naturalidade}</p>
        </div>
        <div className=''>
          <h4> Responsável Por Buscar </h4>
          <p className='text-gray-700'>Nome: {student.responsaveis.name}</p>
          <p className='text-gray-700'>Parentesco: {student.responsaveis.parentesco}</p>
          <p className='text-gray-700'>Tel.: {student.responsaveis.phone}</p>
        </div>
      </div>

      <h2>Observações Médicas</h2>
      <div className='border'>
        <div>
          <p className='text-gray-700'>Hospital: {student.observacoesMedicas.hospital}</p>
          <p className='text-gray-700'>Telefone: {student.observacoesMedicas.hospitalPhone}</p>
        </div>
        <div>
          <p className='text-gray-700'>Médico: {student.observacoesMedicas.doctor}</p>
          <p className='text-gray-700'>Telefone: {student.observacoesMedicas.doctorPhone}</p>
        </div>
        <div>
          <p className='text-gray-700'>Médico: {student.observacoesMedicas.endereco}</p>
          <p className='text-gray-700'>Telefone: {student.observacoesMedicas.observacoes}</p>
        </div>

        <div className="flex">
          <p className='text-gray-700' >Convênio</p>
          <div className="flex">
            <div className="flex items-center me-4">
              <input id="inline-radio" type="radio" checked={student.observacoesMedicas.convenio} name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="inline-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sim</label>
            </div>
            <div className="flex items-center me-4">
              <input id="inline-2-radio" type="radio" checked={!student.observacoesMedicas.convenio} name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Não</label>
            </div>
          </div>
        </div>
      </div>

      <ModalCreateStudent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studentToEdit={student}
      />

    </div>
  )
}
