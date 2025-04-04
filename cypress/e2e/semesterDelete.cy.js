describe('Semester Management - Delete Semester', () => {
  beforeEach(() => {
    cy.visit('/semester-management');
  });

  it('should display a list of semesters or a message when no semesters are present', () => {
    cy.get('[data-testid="semester-list"], [data-testid="no-semesters-message"]', { timeout: 10000 }).should('exist').then(($element) => {
      if ($element.is('[data-testid="no-semesters-message"]')) {
        cy.get('[data-testid="no-semesters-message"]').should('be.visible')
          .and('contain', 'No semesters found. Please add a semester.');
      } else {
        cy.get('[data-testid="semester-list"]').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should delete a semester and show success or error message and update the UI', () => {
    cy.get('[data-testid="semester-item"], [data-testid="no-semesters-message"]', { timeout: 10000 })
      .should('exist')
      .then(($element) => {
        if ($element.is('[data-testid="no-semesters-message"]')) {
          cy.get('[data-testid="no-semesters-message"]').should('be.visible')
            .and('contain', 'No semesters found. Please add a semester.');
        } else {
          cy.get('[data-testid="semester-item"]')
            .first() 
            .invoke('text') 
            .then((semesterText) => {
              const semesterName = semesterText.trim();
              cy.log(`Deleting semester: ${semesterName}`);
              cy.get('[data-testid="semester-item"]')
                .first()
                .find('[data-testid="delete-semester"]') 
                .click();
              cy.get('[data-testid="semester-notification"]').should('contain', 'Semester deleted successfully!');
              cy.reload();
              cy.contains(semesterName).should('not.exist');
            });
        }
      });
  });
  
  
});
