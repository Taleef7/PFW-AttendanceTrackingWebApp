describe("Course Management Page", () => {
    beforeEach(() => {
      cy.visit('/course-management/semester-id');
    });
  
    it("should display courses for the selected semester", () => {
      cy.contains("Courses for Semester").should("be.visible");
      cy.contains('Operating Systems')
      .should('be.visible');
    });
  
    it("should open the add course form when the 'Add Course' button is clicked", () => {
      cy.get('[data-testid="add-course-button"]').click();
  
      cy.get('[data-testid="course-form"]').should("be.visible");
      cy.get('[data-testid="course-id-input"]').should("be.visible");
      cy.get('[data-testid="course-name-input"]').should("be.visible");
      cy.get('[data-testid="course-button"]').contains("Add Course");
    });
  
    it("should show an error if the course form is submitted with empty fields", () => {
      cy.get('[data-testid="add-course-button"]').click();
  
      cy.get('[data-testid="course-button"]').click();
  
      cy.get('[data-testid="ErrorOutlineIcon"]')
        .should("be.visible");
    });
  
    it("should add a new course when valid data is provided", () => {
        cy.get('[data-testid="add-course-button"]')
        .should('be.visible')
        .click();
  
        cy.get('[data-testid="course-id-input"]')
        .type('CS101');
        
        cy.get('[data-testid="course-name-input"]')
        .type('Computer Science');
  
        cy.get('[data-testid="course-button"]')
        .should('be.visible')
        .click();
  
      cy.contains('Computer Science')
        .should('be.visible');
        
      cy.contains('CS101')
        .should('be.visible');
    });
  
    it("should edit an existing course", () => {
      // Click on the edit button for a course
      cy.get('[data-testid="EditIcon"]').first().click();
  
      // Check if the form is populated with course data
      cy.contains('CS104')
        .should('be.visible');

        cy.contains('Operating Systems')
        .should('be.visible');

      // Edit the course data
      cy.get('[data-testid="course-name-input"]').clear().type("Advanced Computer Science");
  
      // Submit the form
      cy.get('[data-testid="course-button"]').click();
  
      // Check for success notification
      cy.get('[data-testid="notification"]').should("contain.text", "Course updated successfully!");
  
      // Check if the course name has been updated in the course list
      cy.contains('Advanced Computer Science')
      .should('be.visible');  
      });
  
    it("should delete a course", () => {
      // Click on the delete button for a course
      cy.get('[data-testid="DeleteIcon"]').first().click();
  
      cy.get('[data-testid="notification"]').should("contain.text", "Course deleted successfully!");
    });
  
    it("should handle cancel button in the form", () => {
      // Open the add course form
      cy.get('[data-testid="add-course-button"]').click();
  
      // Click the cancel button
      cy.get('[data-testid="cancel-button"]').click();
    });
  });
  