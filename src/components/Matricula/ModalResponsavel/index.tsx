'use client';

import { Modal, Form, Input } from 'antd';
import InputMask from 'react-input-mask';
import { useState } from 'react';

// Props do componente
type ModalResponsavelProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (nome: string, parentesco: string, telefone: string) => void;
};

const ModalResponsavel: React.FC<ModalResponsavelProps> = ({ isVisible, onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [telefone, setTelefone] = useState('');

  // Limpa os campos ao fechar a modal
  const handleCancel = () => {
    setNome('');
    setParentesco('');
    setTelefone('');
    onClose();
  };

  // Salva os dados e reseta os campos
  const handleOk = () => {
    if (nome.trim() && parentesco.trim() && telefone.trim()) {
      onSave(nome, parentesco, telefone);
      setNome('');
      setParentesco('');
      setTelefone('');
      onClose();
    }
  };

  return (
    <Modal
      title="Adicionar Responsável"
      visible={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form layout="vertical">
        <Form.Item label="Nome do Responsável" required>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do responsável"
          />
        </Form.Item>
        <Form.Item label="Parentesco" required>
          <Input
            value={parentesco}
            onChange={(e) => setParentesco(e.target.value)}
            placeholder="Digite o parentesco"
          />
        </Form.Item>
        <Form.Item label="Telefone" required>
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Digite o telefone"
              />
            )}
          </InputMask>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalResponsavel;
