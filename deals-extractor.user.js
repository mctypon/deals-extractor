// ==UserScript==
// @name        Dealabs Extractor
// @namespace   Violentmonkey Scripts
// @match       https://www.dealabs.com/bons-plans/*
// @grant       none
// @version     1.0
// @author      mctypon
// @description Extract comments, title, and description from Dealabs pages and copy to clipboard.
// @icon        https://www.dealabs.com/favicon.ico
// @updateURL   https://github.com/mctypon/deals-extractor/raw/refs/heads/main/deals-extractor.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the Extract button
    let extractButton = document.createElement('button');
    extractButton.textContent = 'Extract';
    extractButton.style.position = 'fixed';
    extractButton.style.top = '10px';
    extractButton.style.right = '20px';
    extractButton.style.backgroundColor = '#03a5c1';
    extractButton.style.color = 'white';
    extractButton.style.border = 'none';
    extractButton.style.padding = '10px 20px';
    extractButton.style.fontSize = '16px';
    extractButton.style.cursor = 'pointer';
    extractButton.style.borderRadius = '50vh';
    extractButton.style.zIndex = '1000';

    // Append button to the body
    document.body.appendChild(extractButton);

    // Function to handle button click
    extractButton.addEventListener('click', extractComments);

    // Utility function to add delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to extract comments, title, and description
    async function extractComments() {
        let replyButtons = document.querySelectorAll("button[data-t='moreReplies']");
        replyButtons.forEach(bt => { bt.click(); });

        // Wait 2 seconds for replies to load
        await delay(2000);

        let title = document.querySelector("h1")?.innerText || "No title found";
        let description = document.querySelector("div[data-t='description']")?.innerText || "No description found";

        let comments = document.querySelectorAll('.commentList-comment'); // Select all comments
        let output = `Title: ${title}\nDescription:\n${description}\n\nComments:\n`;

        comments.forEach(comment => {
            // Extract commenter name and message
            let commenter = comment.querySelector('.comment-header button').textContent.trim();
            let message = comment.querySelector('.comment-body div').textContent.trim();

            output += `- ${commenter}: ${message}\n`;

            // Check if there are replies
            let replies = comment.querySelectorAll('.comment-replies-item');
            replies.forEach(reply => {
                let replier = reply.querySelector('.comment-header button').textContent.trim();
                let replyMessage = reply.querySelector('.comment-body div').textContent.trim();
                output += `\t- ${replier}: ${replyMessage}\n`;
            });
        });

        // Copy to clipboard and show notification
        copyToClipboard(output);
        showToast('Content copied to clipboard !');
    }

    // Function to copy the text to clipboard
    function copyToClipboard(text) {
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to show a toast notification
    function showToast(message) {
        let toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#36b7cd';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '16px';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(toast);

        // Show the toast
        setTimeout(() => { toast.style.opacity = '1'; }, 100);

        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);
    }
})();
