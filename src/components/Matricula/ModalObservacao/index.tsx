'use client';

import { Modal, Form, Input } from 'antd';
import { useState } from 'react';

// Props do componente
type ModalObservacaoProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (titulo: string, descricao: string) => void;
};

const ModalObservacao: React.FC<ModalObservacaoProps> = ({ isVisible, onClose, onSave }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  // Limpa os campos ao fechar a modal
  const handleCancel = () => {
    setTitulo('');
    setDescricao('');
    onClose();
  };

  // Salva os dados e reseta os campos
  const handleOk = () => {
    if (titulo.trim() && descricao.trim()) {
      onSave(titulo, descricao);
      setTitulo('');
      setDescricao('');
      onClose();
    }
  };

  return (
    <Modal
      title="Adicionar Observação"
      visible={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form layout="vertical">
        <Form.Item label="Título da Observação" required>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título"
          />
        </Form.Item>
        <Form.Item label="Descrição da Observação" required>
          <Input.TextArea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalObservacao;
