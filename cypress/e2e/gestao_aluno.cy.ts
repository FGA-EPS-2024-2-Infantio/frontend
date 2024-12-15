describe('Funcionalidade Gestão de Alunos', () => {
    beforeEach(() => {
        cy.get('input[name="username"]').type('lucas@gmail.com');
        cy.get('input[name="password"]').type('12345');
    
        cy.contains('Sign in with Credentials').click();
    
        cy.url().should('not.include', '/auth/signin');
    
            
        cy.contains('Alunos').click();
    
        cy.wait(6000);
    
      });

      afterEach(()=>{
        
      cy.wait(2000);
      cy.contains('Sair do sistema').click();
      cy.contains('Sign out').click();
      })

    it('Criar um aluno - Parcial e Matutino', ()=>{
      
      cy.contains('Adicionar Alunos').click();

      cy.get('input[id="name"]').type('Gabriel Ferreira');
      
      cy.get('input#turn').click();
      cy.contains('.ant-select-item', 'Matutino', { timeout: 5000 }).should('be.visible').click();

      cy.get('input#categorie').click();
      cy.contains('.ant-select-item', 'Parcial', { timeout: 5000 }).should('be.visible').click();

      cy.get('input#class').click();
      cy.contains('.ant-select-item', 'Creche', { timeout: 5000 }).should('be.visible').click();

      cy.contains('Cancelar').click();

    })

    it('Editar aluno', ()=>{
      cy.contains('Gabriel Ferreira').click();

      cy.wait(6000);

      cy.contains('Ações').click();
      cy.contains('Editar Estudante').click();

      cy.get('input[id="name"]').clear().should('have.value', '').type('Gabriel Ferreira');
      
      cy.get('input#turn').click({force: true});
      cy.contains('.ant-select-item', 'Matutino', { timeout: 5000 }).should('be.visible').click();

      cy.get('input#categorie').click({force: true});
      cy.contains('.ant-select-item', 'Parcial', { timeout: 4000 }).should('be.visible').click();

      cy.get('input#class').click({force: true});
      cy.contains('.ant-select-item', 'Escola', { timeout: 4000 }).should('be.visible').click();

      cy.contains('Cadastrar').click();
    })

    it('Desativar aluno ', ()=>{
      cy.contains('Gabriel Ferreira').click();

      cy.wait(3000);

      cy.contains('Ações').click();
      cy.contains('Desativar Estudante').click();
      cy.contains('Não').click();

    })

    it('Copiar link do aluno', ()=>{
      cy.contains('Gabriel Ferreira').click();

      cy.wait(3000);

      cy.contains('Ações').click();
      cy.contains('Copiar link').click();

    })
    
})



