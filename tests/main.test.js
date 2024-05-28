/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://github.com/icefoganalytics/travel-authorization/pulls"}
 */
describe("main.js", () => {
    describe("patchNewPullRequestRedirect", () => {
        test("when given a href for the generic compare button", () => {
            // Arrange
            document.body.innerHTML = `<a href="https://github.com/icefoganalytics/travel-authorization/compare"></a>`

            // Act
            require("../main.js")

            // Assert
            const link = document.querySelector('a[href*="/compare"]')
            expect(link.href).toBe(
                "https://github.com/icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:main"
            )
        })

        test("when given a href for the generic compare button", () => {
            // Arrange
            document.body.innerHTML = `<a href="https://github.com/icefoganalytics/travel-authorization/compare/issue-119/implement-correcting-lines-for-non-travel-status-days-on-estimate-tab?expand=1"></a>`

            // Act
            require("../main.js")

            // Assert
            const link = document.querySelector('a[href*="/compare"]')
            expect(link.href).toBe(
                "https://github.com/icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:issue-119/implement-correcting-lines-for-non-travel-status-days-on-estimate-tab?expand=1"
            )
        })

        test("when branch name that has multiple slashes (path segments), patches the link correctly", () => {
            // Arrange
            document.body.innerHTML = `<a href="https://github.com/icefoganalytics/travel-authorization/compare/issue-36/part-6/build-and-or-normalize-workflow-step-players-back-end?expand=1"></a>`

            // Act
            require("../main.js")

            // Assert
            const link = document.querySelector('a[href*="/compare"]')
            expect(link.href).toBe(
                "https://github.com/icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:issue-36/part-6/build-and-or-normalize-workflow-step-players-back-end?expand=1"
            )
        })
    })
})
