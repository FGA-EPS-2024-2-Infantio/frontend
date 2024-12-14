describe('Funcionalidade Gestão de Turmas', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    
        cy.get('input[name="username"]').type('lucas@gmail.com');
        cy.get('input[name="password"]').type('1234');
    
        cy.contains('Sign in with Credentials').click();
    
        cy.url().should('not.include', '/auth/signin');
    
        cy.contains('Turmas').click();
    
        cy.wait(4000);
  
      });


      it('Adicionar Turma', ()=>{

      });

      it('Desativar Turma', ()=>{

      });

      it('Editar Turma', ()=>{

      });
})