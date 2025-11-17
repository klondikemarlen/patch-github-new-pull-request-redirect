// ==UserScript==
// @name         GitHub Restore Default Pull Request Redirect
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Redirect the "New pull request" button on GitHub to a create a Pull Request against the main branch of this repo, and _not_ the upstream repo
// @author       Marlen
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-body
// @updateURL    https://raw.githubusercontent.com/klondikemarlen/patch-github-new-pull-request-redirect/main/main.js
// @downloadURL  https://raw.githubusercontent.com/klondikemarlen/patch-github-new-pull-request-redirect/main/main.js
// ==/UserScript==

;(function () {
    "use strict"

    function isAlReadyPatched(url) {
        return url.includes("...")
    }

    function patchNewPullRequestRedirect() {
        // Find all "New pull request" buttons
        const newPullRequestButtons = document.querySelectorAll('a[href*="/compare"]')
        if (newPullRequestButtons.length === 0) {
            return
        }

        // Get repo information from current URL
        const currentHref = window.location.href
        //e.g. https://github.com/icefoganalytics/travel-authorization/compare
        const urlSegments = currentHref.split("/")
        const repoOwner = urlSegments[3]
        const repoName = urlSegments[4]

        // Patch each button
        newPullRequestButtons.forEach((newPullRequestButton) => {
            if (isAlReadyPatched(newPullRequestButton.href)) {
                return
            }

            // Change the button's href attribute to the desired URL
            // Check if the URL includes a specific branch
            // e.g. https://github.com/icefoganalytics/travel-authorization/compare/issue-119/implement-correcting-lines-for-non-travel-status-days-on-estimate-tab?expand=1
            const buttonHref = newPullRequestButton.href
            if (buttonHref.includes("/compare/")) {
                const [urlPart, queryParams] = buttonHref.split("?")
                const [_repoPath, branchName] = urlPart.split("/compare/", 7)

                // Adjust the button's href for the specific branch
                // e.g. https://github.com/icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:issue-119/implement-correcting-lines-for-non-travel-status-days-on-estimate-tab?expand=1
                newPullRequestButton.href = `/${repoOwner}/${repoName}/compare/main...${repoOwner}:${repoName}:${branchName}?${queryParams}`
            } else {
                // Default behavior for the main branch
                // e.g. /icefoganalytics/travel-authorization/compare/main...icefoganalytics:travel-authorization:main
                newPullRequestButton.href = `/${repoOwner}/${repoName}/compare/main...${repoOwner}:${repoName}:main`
            }
            // console.log("newPullRequestButton.href", newPullRequestButton.href)
        })
    }

    // Run the function immediately on page load for existing elements
    patchNewPullRequestRedirect()

    // Create a MutationObserver to observe DOM changes
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Run the function again if new nodes are added
                patchNewPullRequestRedirect()
            }
        })
    })

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true })
})()
