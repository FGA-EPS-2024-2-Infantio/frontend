describe('Funcionalidade Gestão de Escolas', () => {
  beforeEach(() => {
    cy.visit('http://34.72.186.216:3000/');

    cy.get('input[name="username"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('admin');

    cy.contains('Sign in with Credentials').click();

    cy.url().should('not.include', '/auth/signin');

        
    cy.contains('Escolas').click();

    cy.wait(6000);

  });

  afterEach(()=>{
    cy.wait(2000);
  })

  it('Criar uma escola', () => {

    cy.contains('Adicionar escola').click();

    cy.get('input[id="name"]').type('Infantio Creche LTDA');
    cy.get('input[id="directorName"]').type('Lucas');
    cy.get('input[id="directorEmail"]').type('lucas@gmail.com');
    cy.get('input[id="directorPassword"]').type('12345');
    cy.get('input[id="numberStudents"]').type('10');

    cy.wait(3000);
    cy.contains('Cadastrar').click(); // Caso for testar o caminho de cadastro adicionar o comando a seguir: cy.contains('Escola criada com sucesso');

    cy.wait(2000);
    cy.contains('Sair do sistema').click();
    cy.contains('Sign out').click();
  })

  it('Acessar perfil da Escola no modo administrador', ()=> {
    
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);
    cy.contains('Habilitada');

    cy.wait(2000);
    cy.contains('Sair do sistema').click();
    cy.contains('Sign out').click();
  })

  it('Editar dados da escola aberta no modo administrador', ()=> {
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);

    cy.contains('Ações').click();

    cy.contains('Editar escola').click();

    cy.get('input[id="name"]').clear().should('have.value', '').type('Infantio');

    cy.get('input[id="numberStudents"]').clear().should('have.value', '').type('10');

    cy.contains('Salvar alterações').click();

    cy.wait(2000);
    cy.contains('Sair do sistema').click();
    cy.contains('Sign out').click();
  })

  it('Desativar perfil da Escola no modo administrador', ()=> {
    cy.contains('lucas@gmail.com').click();

    cy.wait(3000);

    cy.contains('Ações').click();

    cy.contains('Desativar escola').click();

    cy.contains('Não').click();

    cy.wait(2000);
    cy.contains('Sair do sistema').click();
    cy.contains('Sign out').click();
  })

  // it('Ativar perfil da Escola no modo administrador', ()=> {

  // })

})