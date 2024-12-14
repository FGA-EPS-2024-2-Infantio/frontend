describe('Funcionalidade Gestão de Professores', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    
        cy.get('input[name="username"]').type('lucas@gmail.com');
        cy.get('input[name="password"]').type('1234');
    
        cy.contains('Sign in with Credentials').click();
    
        cy.url().should('not.include', '/auth/signin');
    
        cy.contains('Professores').click();
    
      });


      it('Adicionar Professor', ()=>{

      });

      it('Desativar Professor', ()=>{

      });

      it('Editar Professor', ()=>{

      });
})