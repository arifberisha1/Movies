import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddRemoveButtons from '../../movies/AddRemoveButtons';

describe('AddRemoveButtons', () => {
    let mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });

    it('renders add button when option is false', async () => {
        const props = {
            mid: 1,
            email: 'test@example.com',
            routeURL: 'test/route',
            url: 'test/url',
            addButtonText: 'Add',
            removeButtonText: 'Remove'
        };
        mock.onGet(`${props.routeURL}/${props.url}/${props.email}/${props.mid}`).reply(200, false);

        // @ts-ignore
        render(<AddRemoveButtons {...props} />);

        const addButton = screen.getByRole('button', { name: 'Add' });
        const removeButton = screen.queryByRole('button', { name: 'Remove' });

        expect(addButton).toBeInTheDocument();
        expect(removeButton).not.toBeInTheDocument();
    });

    it('calls addButton when add button is clicked', async () => {
        const props = {
            mid: 1,
            email: 'test@example.com',
            routeURL: 'test/route',
            url: 'test/url',
            addButtonText: 'Add',
            removeButtonText: 'Remove',
            addButton: jest.fn(),
            removeButton: jest.fn()
        };
        mock.onGet(`${props.routeURL}/${props.url}/${props.email}/${props.mid}`).reply(200, false);

        render(<AddRemoveButtons {...props} />);

        const addButton = screen.getByRole('button', { name: 'Add' });
        fireEvent.click(addButton);

        expect(props.addButton).toHaveBeenCalledTimes(1);
    });

});
