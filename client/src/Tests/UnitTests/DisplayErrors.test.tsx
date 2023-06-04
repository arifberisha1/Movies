import {getByText, render} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import DisplayErrors from "../../utils/DisplayErrors";

jest.mock("axios");

describe("DisplayErrors component", () => {
    const mockAxios = new MockAdapter(axios);

    afterEach(() => {
        mockAxios.reset();
    });

    it("displays error messages if props.errors is provided", () => {
        const errors = ["Error 1", "Error 2", "Error 3"];

        const {container} = render(<DisplayErrors errors={errors}/>);

        const errorList = container.querySelector("ul");
        expect(errorList).toBeInTheDocument();
        expect(errorList).toHaveStyle("color: red");

        errors.forEach((error) => {
            const errorElement = getByText(container, error);
            expect(errorElement).toBeInTheDocument();
        });
    });

    it("does not display anything if props.errors is not provided", () => {
        const {container} = render(<DisplayErrors/>);
        expect(container.firstChild).toBeNull();
    });
});