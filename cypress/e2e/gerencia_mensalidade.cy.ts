describe('Funcionalidade Gestão de Mensalidade', () => {
  beforeEach(() => {
      cy.visit('http://localhost:3000/');
  
      cy.get('input[name="username"]').type('lucas@gmail.com');
      cy.get('input[name="password"]').type('1234');
  
      cy.contains('Sign in with Credentials').click();
  
      cy.url().should('not.include', '/auth/signin');
  
          
      cy.contains('Alunos').click();
  
      cy.wait(4000);

      cy.contains('Gabriel Ferreira').click();
      cy.wait(2000);

    });

  it('Criar pagamento de mensalidade', ()=>{
     cy.contains('Adicionar Pagamento').click();
     cy.get('input[id="value"]').type('200');

     cy.get('.ant-picker').click();
     cy.get('.ant-picker-cell').contains('Apr').click();
     cy.get('.ant-picker input').should('have.value', '2024/04');

     cy.get('button#payed').click();

    cy.contains('Cancelar').click();

    cy.wait(4000);
  })

  it('Editar pagamento de mensalidade', ()=>{
    cy.get('.ant-table-cell').contains('2024').click();

    cy.get('button#payed').click();

    cy.contains('Cadastrar').click();

    cy.wait(4000);
  })
  
})



