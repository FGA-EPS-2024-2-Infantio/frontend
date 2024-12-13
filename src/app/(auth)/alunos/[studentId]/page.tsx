'use client'
import MonthlyPayment from '@/components/MonthlyPayment'
import ModalCreateStudent from '@/components/Student/ModalCreateStudent'
import { deleteStudentById, fetchStudentById } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { ChevronDown } from '@untitled-ui/icons-react'
import { Button, Dropdown, Popconfirm, Spin, Table } from 'antd'
import { useSession } from 'next-auth/react'
import { useParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function StudentDetails() {

  const { studentId } = useParams()
  const origin = window.location.origin;
  const pathname = usePathname().split('/')[2];
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, student } = useSelector(
    (state: RootState) => state.student
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const studentIdStr = Array.isArray(studentId) ? studentId[0] :studentId

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

  const columnsObservacoes = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },{
    title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
  ];

  const columnsResponsaveis = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Parentesco',
      dataIndex: 'parentesco',
      key: 'parentesco',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
    },
  ];

  const copyToClipboard = () => {

    navigator.clipboard.writeText(origin + "/formulario-matricula/" + pathname)
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

  const session = useSession()

  if (session.data?.user.role !== 'ADMIN' && session.data?.user.role !== 'DIRECTOR') {
    return (
      <div className='mx-6 rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>Você não possui autorização para visualizar essa tela!</div>
      </div>
    )
  }

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
        <h2 className='text-xl font-semibold text-gray-800'>Ficha do(a) Aluno(a): {student.name}</h2>
        <Dropdown menu={{ items: actionMenuItems }} placement='bottomRight'>
          <Button className='flex items-center gap-2'>
            <span>Ações</span>
            <ChevronDown />
          </Button>
        </Dropdown>
      </div>
     
     

        {/* Dados do Aluno */}
        <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
          <h2 className="text-2xl font-semibold mb-6">Dados do Estudante</h2>

          
          {student.disabled ? (
            <p className='text-red-500'>Desabilitada</p>
          ) : (
            <p className='text-green-500'>Habilitada</p>
          )}

          <div className="text-md">
            <p><strong>Nome  Completo:</strong> {student.name}</p>
            <p><strong>Turma:</strong> {student.class}</p>
            <p><strong>Categoria:</strong> {student.categorie}</p>
            <p><strong>Turno:</strong> {student.turn}</p>
            <br></br>
            <p><strong>Data de Nascimento:</strong> {student.dataNascimento}</p>
            <p><strong>Naturalidade:</strong> {student.naturalidadeAluno}</p>
            <p><strong>Endereço:</strong> {student.endereco}</p>
            <p><strong>CEP:</strong> {student.cep}</p>
          </div>
        </div>

        {/* Dados da Mãe */}
        <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-6">Dados da Mãe</h2>
          <div className="text-md">
            <p><strong>Nome:</strong> {student.mae?.nome}</p>
            <p><strong>Telefone:</strong> {student.mae?.telefone}</p>
            <p><strong>RG:</strong> {student.mae?.rg}</p>
            <p><strong>CPF:</strong> {student.mae?.cpf}</p>
            <p><strong>Naturalidade:</strong> {student.mae?.naturalidade}</p>
          </div>
        </div>

        {/* Dados do Pai */}
        <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-6">Dados do Pai</h2>
          <div className="text-md">
            <p><strong>Nome:</strong> {student.pai?.nome}</p>
            <p><strong>Telefone:</strong> {student.pai?.telefone}</p>
            <p><strong>RG:</strong> {student.pai?.rg}</p>
            <p><strong>CPF:</strong> {student.pai?.cpf}</p>
            <p><strong>Naturalidade:</strong> {student.pai?.naturalidade}</p>
          </div>
        </div>

        {/* Observações Médicas */}
        <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-6">Observações Médicas</h2>
          <div className="text-md">
            <p><strong>Hospital:</strong> {student.observacoesMedicas?.hospital}</p>
            <p><strong>Telefone do Hospital:</strong> {student.observacoesMedicas?.telefoneHospital}</p>
            <p><strong>Médico:</strong> {student.observacoesMedicas?.medico}</p>
            <p><strong>Telefone do Médico:</strong> {student.observacoesMedicas?.telefoneMedico}</p>
            <p><strong>Endereço do Hospital:</strong> {student.observacoesMedicas?.enderecoHospital}</p>
            <p><strong>Convênio:</strong> {student.observacoesMedicas?.possuiConvenio ? "Sim" : "Não"}</p>
            <p><strong>Alergias:</strong> {student.observacoesMedicas?.alergias}</p>
            <p><strong>Medicamentos em Caso de Febre:</strong> {student.observacoesMedicas?.medicamentosFebre}</p>
            <p><strong>Medicamentos em Caso de Vômito:</strong> {student.observacoesMedicas?.medicamentosVomito}</p>
            <p><strong>Outras Observações:</strong> {student.observacoesMedicas?.observacoesGerais}</p>
          </div>
        </div>

       {/* Observações sobre o Aluno */}
       <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold mb-6">Observações sobre o Aluno</h2>
            </div>
            <Table columns={columnsObservacoes} dataSource={student.observacoes} pagination={false} locale={{ emptyText: '' }} />
          </div>
        {/* Responsáveis por buscar */}
        <div className="border p-8 rounded-md shadow-sm bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Responsáveis por buscar</h2>
            </div>
            <Table columns={columnsResponsaveis} dataSource={student.responsaveis} pagination={false} locale={{ emptyText: '' }} />
          </div>

      <ModalCreateStudent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studentToEdit={student}
      />

      <MonthlyPayment
        loading={loading}
        payments={student.payments}
        studentId={studentIdStr}
      />
    </div>



  )
  
}
