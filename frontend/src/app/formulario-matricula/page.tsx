'use client'

import { Input, Button, Form, Modal, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import InputMask from 'react-input-mask';
import { useState } from 'react';

// Tipo para observações
type Observacao = {
  key: string;
  titulo: string;
  descricao: string;
};

export default function FormularioMatricula() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]); // Define o tipo como array de Observacao
  const [novaObservacao, setNovaObservacao] = useState<Pick<Observacao, 'titulo' | 'descricao'>>({
    titulo: '',
    descricao: '',
  });

  // Colunas para Observações sobre o Aluno
  const columnsObservacoes = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Observacao) => (
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: 'red' }} />}
          onClick={() => handleDeleteObservacao(record.key)}
        />
      ),
    },
  ];

  // Mostrar o modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fechar o modal e salvar a observação
  const handleOk = () => {
    if (novaObservacao.titulo.trim() && novaObservacao.descricao.trim()) {
      setObservacoes((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, titulo: novaObservacao.titulo, descricao: novaObservacao.descricao },
      ]);
      setNovaObservacao({ titulo: '', descricao: '' });
      setIsModalVisible(false);
    }
  };

  // Fechar o modal sem salvar
  const handleCancel = () => {
    setNovaObservacao({ titulo: '', descricao: '' });
    setIsModalVisible(false);
  };

  // Remover uma observação
  const handleDeleteObservacao = (key: string) => {
    setObservacoes((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-4xl w-full border">
        <Form layout="vertical" className="space-y-6">

           {/* Dados do Aluno */}
           <div className="border p-8 rounded-md shadow-sm bg-white mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-6">Dados para Matrícula do Aluno</h2>
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item label="Data de Nascimento" name="dataNascimento">
                  <InputMask mask="99/99/9999">
                    {(inputProps) => <Input {...inputProps} placeholder="DD/MM/AAAA" />}
                  </InputMask>
                </Form.Item>
                <Form.Item label="Naturalidade" name="naturalidadeAluno">
                  <Input placeholder="Naturalidade" />
                </Form.Item>
              </div>
              <Form.Item label="Endereço" name="endereco">
                <Input placeholder="Endereço completo" />
              </Form.Item>
              <Form.Item label="CEP" name="cep">
                <InputMask mask="99999-999">
                  {(inputProps) => <Input {...inputProps} placeholder="CEP" />}
                </InputMask>
              </Form.Item>
            </div>
          </div>

          {/* Dados da Mãe */}
          <div className="border p-4 rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-lg font-semibold">Dados da Mãe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Nome" name="nomeMae">
                <Input placeholder="Nome da mãe" />
              </Form.Item>
              <Form.Item label="Telefone" name="telefoneMae">
                <InputMask mask="(99) 99999-9999">
                  {(inputProps) => <Input {...inputProps} placeholder="Telefone" />}
                </InputMask>
              </Form.Item>
              <Form.Item label="RG" name="rgMae">
                <Input placeholder="RG" />
              </Form.Item>
              <Form.Item label="CPF" name="cpfMae">
                <InputMask mask="999.999.999-99">
                  {(inputProps) => <Input {...inputProps} placeholder="CPF" />}
                </InputMask>
              </Form.Item>
              <Form.Item label="Naturalidade" name="naturalidadeMae">
                <Input placeholder="Naturalidade" />
              </Form.Item>
            </div>
          </div>

          {/* Dados do Pai */}
          <div className="border p-4 rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-lg font-semibold">Dados do Pai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Nome" name="nomePai">
                <Input placeholder="Nome do pai" />
              </Form.Item>
              <Form.Item label="Telefone" name="telefonePai">
                <InputMask mask="(99) 99999-9999">
                  {(inputProps) => <Input {...inputProps} placeholder="Telefone" />}
                </InputMask>
              </Form.Item>
              <Form.Item label="RG" name="rgPai">
                <Input placeholder="RG" />
              </Form.Item>
              <Form.Item label="CPF" name="cpfPai">
                <InputMask mask="999.999.999-99">
                  {(inputProps) => <Input {...inputProps} placeholder="CPF" />}
                </InputMask>
              </Form.Item>
              <Form.Item label="Naturalidade" name="naturalidadePai">
                <Input placeholder="Naturalidade" />
              </Form.Item>
            </div>
          </div>

          {/* Responsável por Buscar */}
          <div className="border p-4 rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-lg font-semibold">Responsável por Buscar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Nome" name="nomeResponsavel">
                <Input placeholder="Nome do responsável" />
              </Form.Item>
              <Form.Item label="Parentesco" name="parentescoResponsavel">
                <Input placeholder="Parentesco" />
              </Form.Item>
              <Form.Item label="Telefone" name="telefoneResponsavel">
                <InputMask mask="(99) 99999-9999">
                  {(inputProps) => <Input {...inputProps} placeholder="Telefone" />}
                </InputMask>
              </Form.Item>
            </div>
          </div>


          {/* Observações sobre o Aluno */}
          <div className="border p-4 rounded-md shadow-sm bg-white mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Observações sobre o Aluno</h2>
              <Button type="primary" onClick={showModal}>
                + Adicionar
              </Button>
            </div>
            <Table columns={columnsObservacoes} dataSource={observacoes} pagination={{ pageSize: 5 }} locale={{ emptyText: '' }} />
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-center mt-4">
            <Button type="primary" htmlType="submit">
              Mandar Dados para Matrícula
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal */}
      <Modal
        title="Adicionar Observação"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Título da Observação" required>
            <Input
              value={novaObservacao.titulo}
              onChange={(e) => setNovaObservacao((prev) => ({ ...prev, titulo: e.target.value }))}
              placeholder="Digite o título"
            />
          </Form.Item>
          <Form.Item label="Descrição da Observação" required>
            <Input.TextArea
              value={novaObservacao.descricao}
              onChange={(e) => setNovaObservacao((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Digite a descrição"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}