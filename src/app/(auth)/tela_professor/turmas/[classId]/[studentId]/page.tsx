'use client'
import { fetchStudentById } from '@/store/slices/studentSlice'
import { AppDispatch, RootState } from '@/store/store'
import { Spin } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function ProfessorStudentDetails() {
  const { studentId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, student } = useSelector(
    (state: RootState) => state.student
  )

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
      </div>
      {student.disabled ? (
        <p className='text-red-500'>Desabilitada</p>
      ) : (
        <p className='text-green-500'>Habilitada</p>
      )}
      <h1>Dados do Aluno</h1>
      <div className='border'>
        <p className='text-gray-700'>Nome do aluno: {student.name} </p>
        <div className=''>
          <p className='text-gray-700'>
            Data de Nascimento: {student.dataNascimento}
          </p>
          <p className='text-gray-700'>
            Naturalidade: {student.naturalidadeAluno}
          </p>
          <p className='text-gray-700'>Endereço: {student.endereco}</p>
          <p className='text-gray-700'>CEP: {student.cep}</p>
        </div>
        <div className=''>
          <h4> Dados da Mãe </h4>
          <p className='text-gray-700'>
            Data de Nascimento: {student.mae?.nome}
          </p>
          <p className='text-gray-700'>Tel.: {student.mae?.telefone}</p>
          <p className='text-gray-700'>Endereço: {student.mae?.rg}</p>
          <p className='text-gray-700'>CPF: {student.mae?.cpf}</p>
          <p className='text-gray-700'>
            Naturalidade: {student.mae?.naturalidade}
          </p>
        </div>
        <div className=''>
          <h4> Dados do Pai </h4>
          <p className='text-gray-700'>
            Data de Nascimento: {student.pai?.nome}
          </p>
          <p className='text-gray-700'>Tel.: {student.pai?.telefone}</p>
          <p className='text-gray-700'>Endereço: {student.pai?.rg}</p>
          <p className='text-gray-700'>CPF: {student.pai?.cpf}</p>
          <p className='text-gray-700'>
            Naturalidade: {student.pai?.naturalidade}
          </p>
        </div>
        <div className=''>
          <h4> Responsável Por Buscar </h4>
          {student.responsaveis?.map(responsavel => (
            <>
              <p className='text-gray-700'>
                Parentesco: {responsavel.parentesco}
              </p>
              <p className='text-gray-700'>Tel.: {responsavel.telefone}</p>
              <p className='text-gray-700'>Nome: {responsavel.nome}</p>
            </>
          ))}
        </div>
      </div>

      <h2>Observações Médicas</h2>
      <div className='border'>
        <div>
          <p className='text-gray-700'>
            Hospital: {student.observacoesMedicas?.hospital}
          </p>
          <p className='text-gray-700'>
            Telefone: {student.observacoesMedicas?.telefoneHospital}
          </p>
        </div>
        <div>
          <p className='text-gray-700'>
            Médico: {student.observacoesMedicas?.medico}
          </p>
          <p className='text-gray-700'>
            Telefone: {student.observacoesMedicas?.telefoneMedico}
          </p>
        </div>
        <div>
          <p className='text-gray-700'>
            Endereço: {student.observacoesMedicas?.enderecoHospital}
          </p>
        </div>

        <div className='flex'>
          <p className='text-gray-700'>Convênio</p>
          <div className='flex'>
            <div className='me-4 flex items-center'>
              <input
                id='inline-radio'
                type='radio'
                readOnly
                checked={student.observacoesMedicas?.possuiConvenio}
                name='inline-radio-group'
                className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
              <label
                htmlFor='inline-radio'
                className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
              >
                Sim
              </label>
            </div>
            <div className='me-4 flex items-center'>
              <input
                readOnly
                id='inline-2-radio'
                type='radio'
                checked={!student.observacoesMedicas?.possuiConvenio}
                name='inline-radio-group'
                className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
              />
              <label
                htmlFor='inline-2-radio'
                className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
              >
                Não
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
