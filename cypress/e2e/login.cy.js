describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should show an error for invalid email format", () => {
    cy.get('[data-testid="email-input"]').type("invalid-email");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="login-button"]').click();
    cy.contains("Please enter a valid email address.").should("be.visible");
  });

  it("should show an error when the password is missing", () => {
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').clear();
    cy.get('[data-testid="login-button"]').click();
    cy.contains("Password is required.").should("be.visible");
  });

  it("should show an error when the user is not found", () => {
    cy.get('[data-testid="email-input"]').type("invalid@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="login-button"]').click();
    cy.contains("Please check credentials and try again.").should("be.visible");
  });

  it("should show an error when the password is incorrect", () => {
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    cy.get('[data-testid="login-button"]').click();
    cy.contains("Please check credentials and try again.").should("be.visible");
  });
});
