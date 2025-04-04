describe('Course Management - Add Course', () => {
    beforeEach(() => {
      cy.visit('/course-management/semester-id');
    });
  
    it('Clicking the "+" (Add Course) button should open the pop-up', () => {
        cy.get('[data-testid="add-course-button"]')
          .should('be.visible')
          .click();
        
        cy.get('[data-testid="course-form"]')
          .should('be.visible');
    });
    
  
    it('Entering a valid Course ID and Course Name and clicking "Add Course" should save the course under the current semester', () => {
        cy.get('[data-testid="add-course-button"]')
          .should('be.visible')
          .click();
    
        cy.get('[data-testid="course-id-input"]')
          .type('CS101');
          
        cy.get('[data-testid="course-name-input"]')
          .type('Introduction to Computer Science');
    
        cy.get('[data-testid="course-button"]')
          .should('be.visible')
          .click();
    
        cy.contains('Introduction to Computer Science')
          .should('be.visible');
          
        cy.contains('CS101')
          .should('be.visible');
    });
    
    it('The course should immediately appear on the course landing page', () => {
        cy.get('[data-testid="add-course-button"]')
          .should('be.visible')
          .click();
      
        cy.get('[data-testid="course-id-input"]')
          .type('CS102');
        cy.get('[data-testid="course-name-input"]')
          .type('Data Structures');
      
        cy.get('[data-testid="course-button"]')
          .should('be.visible')
          .click();
      
        cy.wait(1000);
      
        cy.contains('Data Structures')
          .should('be.visible');
      
        cy.contains('CS102')
          .should('be.visible');
      });
      
      it('Clicking "Cancel" should close the pop-up without saving', () => {
        cy.get('[data-testid="add-course-button"]')
          .should('be.visible')
          .click();
      
        cy.get('[data-testid="course-id-input"]')
          .type('CS103');
        cy.get('[data-testid="course-name-input"]')
          .type('Algorithms');
      
        cy.get('[data-testid="cancel-button"]')
          .should('be.visible')
          .click();
      
        cy.get('[data-testid="course-form"]')
          .should('not.exist');
      });
      
  
      it('Refreshing the page should retain the newly added course', () => {
        cy.get('[data-testid="add-course-button"]')
          .should('be.visible')
          .click();
      
        cy.get('[data-testid="course-id-input"]')
          .type('CS104');
        cy.get('[data-testid="course-name-input"]')
          .type('Operating Systems');
      
        cy.get('[data-testid="course-button"]')
          .should('be.visible')
          .click();
      
        cy.wait(1000);
      
        cy.reload();
      
        cy.contains('Operating Systems')
          .should('be.visible');
      
        cy.contains('CS104')
          .should('be.visible');
      });
      
  });
  