//if needed
export default function Button(props: buttonProps) {
    return <button type={props.type} className={props.className}
                   onClick={props.onClick}
    >{props.children}</button>
}

interface buttonProps {
    children: React.ReactNode;
    type: "button" | "submit";
    disabled: boolean;
    className: string;

    onClick?(): void;
}

Button.defaultProps = {
    type: "button",
    disabled: false,
    className: "btn btn-primary"
}