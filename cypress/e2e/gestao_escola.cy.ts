describe('Funcionalidade Gestão de Escolas', () => {
  beforeEach(() => {
    cy.get('input[name="username"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('admin');
    cy.contains('Sign in with Credentials').click();
    cy.contains('Escolas').click();
    cy.wait(5000);

  });

  afterEach(()=>{
    cy.wait(3000);
    cy.contains('Sair do sistema').click();
    cy.contains('Sign out').click();
  })

  it('Criar uma escola', () => {

    cy.contains('Adicionar escola').click();

    cy.get('input[id="name"]').type('Infantio Creche LTDA');
    cy.get('input[id="directorName"]').type('Lucas');
    cy.get('input[id="directorEmail"]').type('lucas@gmail.com');
    cy.get('input[id="directorPassword"]').type('12345');
    cy.get('input[id="numberStudents"]').type('10');

    cy.wait(3000);
    cy.contains('Cancelar').click(); 

  })

  it('Acessar perfil da Escola no modo administrador', ()=> {
    
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);
    cy.contains('Habilitada');

  })

  it('Editar dados da escola aberta no modo administrador', ()=> {
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);

    cy.contains('Ações').click();

    cy.contains('Editar escola').click();

    cy.get('input[id="name"]').clear().should('have.value', '').type('Infantio');

    cy.get('input[id="numberStudents"]').clear().should('have.value', '').type('10');

    cy.contains('Salvar alterações').click();

  })

  it('Desativar perfil da Escola no modo administrador', ()=> {
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);

    cy.contains('Ações').click();

    cy.contains('Desativar escola').click();

    cy.contains('Não').click();
  })

})