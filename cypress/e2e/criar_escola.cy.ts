describe('Criar escola', () => {
  it('Deve realizar login e criar uma escola', () => {
    cy.visit('http://localhost:3000');

    cy.get('input[name="username"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('admin');

    cy.contains('Sign in with Credentials').click();

    cy.url().should('not.include', '/auth/signin');

    cy.contains('Escolas').click();
  })
})