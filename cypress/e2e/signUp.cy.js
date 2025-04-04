describe('Register Component', () => {
    beforeEach(() => {
      cy.visit('/register'); 
    });
  
    it('should render the registration form correctly', () => {
      cy.contains('label', 'Email').should('exist'); // Check if Email label exists for the TextField
      cy.contains('label', 'Password').should('exist'); // Check if Password label exists for the TextField
      cy.contains('label', 'Confirm Password').should('exist'); // Check if Confirm Password label exists for the TextField
      cy.get('button').contains('Register').should('exist'); // Check if Register button is displayed
    });
  
    it('should show error message when passwords do not match', () => {
      cy.get('label').contains('Email').parent().find('input').type('test@gmail.com');
      cy.get('label').contains('Password').parent().find('input').type('password123');
      cy.get('label').contains('Confirm Password').parent().find('input').type('password124');
      cy.get('button').contains('Register').click();
  
      cy.get('.MuiSnackbar-root').should('exist'); // Check if Snackbar is displayed
      cy.get('.MuiAlert-message').should('contain', 'Passwords do not match.'); // Check error message
    });
  
    it('should show success message on successful registration', () => {
      cy.get('label').contains('Email').parent().find('input').type('test88@gmail.com');
      cy.get('label').contains('Password').parent().find('input').type('password123');
      cy.get('label').contains('Confirm Password').parent().find('input').type('password123');
      cy.get('button').contains('Register').click();
  
      cy.get('.MuiSnackbar-root').should('exist'); // Check if Snackbar is displayed
      cy.get('.MuiAlert-message').should('contain', 'Registration successful! Please check your email to verify your account.'); // Check success message
    });
  
    it('should redirect to login page after successful registration', () => {
      cy.get('label').contains('Email').parent().find('input').type('test68@gmail.com');
      cy.get('label').contains('Password').parent().find('input').type('password123');
      cy.get('label').contains('Confirm Password').parent().find('input').type('password123');
      cy.get('button').contains('Register').click();
  
      cy.wait(3000);
      cy.url().should('include', 'http://localhost:3000/login');
    });

    it('should navigate to login page when login link is clicked', () => {
        cy.get('button').contains('Login').click();
        
        cy.url().should('include', 'http://localhost:3000/login');
      });
      
  
    it('should disable the register button when loading', () => {
      cy.get('label').contains('Email').parent().find('input').type('test@example.com');
      cy.get('label').contains('Password').parent().find('input').type('password123');
      cy.get('label').contains('Confirm Password').parent().find('input').type('password123');
      cy.get('button').contains('Register').click();
  
      cy.get('button').contains('Register').should('be.disabled');
    });
  });
  

