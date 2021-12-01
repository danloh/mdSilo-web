import user from '../fixtures/user.json';

describe('signin', () => {
  beforeEach(() => {
    // seed the database
    cy.exec('npm run db:seed');
  });

  it('can successfully sign in', () => {
    cy.visit('/signin');

    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/app');
  });
});
