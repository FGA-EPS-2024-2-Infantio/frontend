describe('Funcionalidade Login', () => {

    beforeEach(()=>{
      cy.visit('http://localhost:3000/');
    })

    it('Não deve realizar login', () => {
        cy.get('input[name="username"]').type('admin@admin.com');
        cy.get('input[name="password"]').type('adm');
    
        cy.contains('Sign in with Credentials').click();

        cy.wait(2000);

        cy.url().should('include', '/api/auth/signin');

        cy.wait(2000);

    })

    it('Realizar login', () => {  
      cy.get('input[name="username"]').type('admin@admin.com');
      cy.get('input[name="password"]').type('admin');
  
      cy.contains('Sign in with Credentials').click();
  
      cy.url().should('include', 'http://localhost:3000/');

      cy.wait(2000);
      cy.contains('Sair do sistema').click();
      cy.contains('Sign out').click();
    })
  })