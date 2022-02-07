import React from "react";
import { mount } from "@cypress/react";
import App from "../../src/App";
import { Providers } from "../../src/components/Providers/Providers";

it("renders My Routines heading", () => {
  cy.visit('http://localhost:3001/')
  cy.get("h1").contains("My Routines");
});
