import { render, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Button from "../../utils/Button";

describe("Button", () => {
    let mockAxios = new MockAdapter(axios);

    afterEach(() => {
        mockAxios.reset();
    });

    it("renders a button with default props", () => {
        const { getByText } = render(<Button>Submit</Button>);
        const button = getByText("Submit");

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "button");
        expect(button).not.toBeDisabled();
        expect(button).toHaveClass("btn btn-primary");
    });

    it("invokes the onClick callback when the button is clicked", () => {
        const handleClick = jest.fn();
        const { getByText } = render(<Button onClick={handleClick}>Submit</Button>);
        const button = getByText("Submit");

        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

});