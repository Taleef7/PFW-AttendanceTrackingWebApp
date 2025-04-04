describe("Semester Management", () => {
    beforeEach(() => {
        cy.visit("/semester-management");
    });

    const getRandomDateInRange = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const generateSemesterDates = (startRange, endRange) => {
        let startDate = getRandomDateInRange(startRange, endRange);

        if (new Date(startDate).setMonth(startDate.getMonth() + 6) > endRange) {
            startDate = getRandomDateInRange(startRange, new Date(endRange.setMonth(endRange.getMonth() - 6)));
        }

        let endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 6);

        return {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
        };
    };

    it("should open the add semester pop-up when clicking the 'Add Semester' button", () => {
        cy.contains("Add Semester").click();
        cy.get(".MuiModal-root").should("be.visible");
    });

    it("should add a semester successfully when valid details are entered", () => {
        const dateRangeStart = new Date(2030, 0, 1);
        const dateRangeEnd = new Date(2100, 11, 31);
        const { startDate, endDate } = generateSemesterDates(dateRangeStart, dateRangeEnd);

        cy.contains("Add Semester").click();
        cy.get("[data-testid='semester-name']").type("Spring 2025");
        cy.get("[data-testid='start-date']").type(startDate);
        cy.get("[data-testid='end-date']").type(endDate);
        cy.get("[data-testid='semester-submit']").click();

        cy.contains("Semester added successfully!").should("be.visible");
        cy.contains("Spring 2025").should("exist");

        cy.log(`Start Date: ${startDate}`);
        cy.log(`End Date: ${endDate}`);
    });


    it("should show a validation error if the end date is before the start date", () => {
        cy.contains("Add Semester").click();
        cy.get("[data-testid='semester-name']").type("Invalid Semester");
        cy.get("[data-testid='start-date']").type("2025-05-15");
        cy.get("[data-testid='end-date']").type("2025-01-15");
        cy.get("[data-testid='semester-submit']").click();

        cy.contains("End date must be greater than start date.").should("be.visible");
    });

    it("should discard changes and close the pop-up when clicking 'Cancel'", () => {
        cy.contains("Add Semester").click();
        cy.get("[data-testid='semester-name']").type("Temporary Semester");
        cy.contains("Cancel").click();

        cy.get(".MuiModal-root").should("not.exist");
        cy.contains("Temporary Semester").should("not.exist");
    });

    it("should retain the newly added semester after refreshing the page", () => {
        const dateRangeStart = new Date(2101, 0, 1);
        const dateRangeEnd = new Date(2200, 11, 31);

        const { startDate, endDate } = generateSemesterDates(dateRangeStart, dateRangeEnd);

        cy.contains("Add Semester").click();
        cy.get("[data-testid='semester-name']").type("Persistent Semester");
        cy.get("[data-testid='start-date']").type(startDate);
        cy.get("[data-testid='end-date']").type(endDate);
        cy.get("[data-testid='semester-submit']").click();

        cy.contains("Persistent Semester").should("exist");
        cy.reload();
        cy.contains("Persistent Semester").should("exist");
    });
});
