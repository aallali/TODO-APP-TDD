/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthForm from './Index';
import { useAuthStore } from './auth.store';
import { loginAPI, registerAPI, whoAmI } from './auth.api';

// Mock the auth store hook
jest.mock('./auth.store', () => ({
    useAuthStore: jest.fn()
}));

// Mock the API calls
jest.mock('./auth.api', () => ({
    loginAPI: jest.fn(),
    registerAPI: jest.fn(),
    whoAmI: jest.fn()
}));

describe('AuthForm', () => {
    const setUser = jest.fn();
    const setToken = jest.fn();

    beforeEach(() => {
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            setUser,
            setToken
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the login form', () => {
        render(<AuthForm />);
        expect(document.querySelector('input[name="username"]')).toBeInTheDocument();
        expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
        expect(screen.getByText(/Login Details/i)).toBeInTheDocument();
    });

    it('validates the username and password fields', () => {
        render(<AuthForm />);

        // Enter invalid username
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'ab' } });
        fireEvent.blur(screen.getByPlaceholderText(/username/i));
        expect(screen.getByText(/username must be alphanumeric/i)).toBeInTheDocument();

        // Enter valid username
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'abc123' } });
        fireEvent.blur(screen.getByPlaceholderText(/username/i));
        expect(screen.queryByText(/username must be alphanumeric/i)).not.toBeInTheDocument();

        // Enter invalid password
        const psswdPlaceholderRGX = /\*\*\*\*\*\*\*\*/i
        fireEvent.change(screen.getByPlaceholderText(psswdPlaceholderRGX), { target: { value: '+++' } });
        fireEvent.blur(screen.getByPlaceholderText(psswdPlaceholderRGX));
        expect(screen.getByText(/password must be alphanumeric/i)).toBeInTheDocument();

        // Enter valid password
        fireEvent.change(screen.getByPlaceholderText(psswdPlaceholderRGX), { target: { value: 'abc123' } });
        fireEvent.blur(screen.getByPlaceholderText(psswdPlaceholderRGX));
        expect(screen.queryByText(/password must be alphanumeric/i)).not.toBeInTheDocument();
    });

    it('submits the login form successfully', async () => {
        (loginAPI as jest.Mock).mockResolvedValue({ success: true, token: 'fake-token' });
        (whoAmI as jest.Mock).mockResolvedValue({ user: { username: 'allali', _id: '6646a9996e50de6efe61782b' } });

        render(<AuthForm />);

        fireEvent.change(screen.getByTestId('username'), { target: { value: 'allali' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'psswd' } });


        fireEvent.click(screen.getByTestId('submitBTN'));

        await waitFor(() => {
            expect(loginAPI).toHaveBeenCalledWith('allali', 'psswd');
            expect(whoAmI).toHaveBeenCalled();
            expect(setToken).toHaveBeenCalledWith('fake-token');
            expect(setUser).toHaveBeenCalledWith('allali', '6646a9996e50de6efe61782b');
        });
    });

    it('handles login error', async () => {
        (loginAPI as jest.Mock).mockResolvedValue({ success: false, error: 'Invalid credentials' });
        jest.spyOn(window, 'alert').mockImplementation(() => { });


        render(<AuthForm />);

        fireEvent.change(screen.getByTestId('username'), { target: { value: 'allali' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'psswd' } });

        fireEvent.click(screen.getByTestId('submitBTN'));

        await waitFor(() => {
            expect(loginAPI).toHaveBeenCalledWith('allali', 'psswd');
            expect(window.alert).toBeCalledWith("Invalid credentials");
        });
    });

    it('submits the registration form successfully', async () => {
        (registerAPI as jest.Mock).mockResolvedValue({ success: true, message: 'Registration successful' });
        jest.spyOn(window, 'alert').mockImplementation(() => { });

        render(<AuthForm />);

        fireEvent.click(screen.getByText(/register now/i));

        fireEvent.change(screen.getByTestId('username'), { target: { value: 'allali' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'psswd' } });

        fireEvent.click(screen.getByTestId('submitBTN'));

        await waitFor(() => {
            expect(registerAPI).toHaveBeenCalledWith('allali', 'psswd');
            expect(window.alert).toBeCalledWith("Registration successful");
        });
    });

    it('handles error registration', async () => {
        (registerAPI as jest.Mock).mockResolvedValue({ success: true, message: 'Duplicated Username :), safi ghyrha' });
        jest.spyOn(window, 'alert').mockImplementation(() => { });

        render(<AuthForm />);

        fireEvent.click(screen.getByText(/register now/i));

        fireEvent.change(screen.getByTestId('username'), { target: { value: 'allali' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'psswd' } });

        fireEvent.click(screen.getByTestId('submitBTN'));

        await waitFor(() => {
            expect(registerAPI).toHaveBeenCalledWith('allali', 'psswd');
            expect(window.alert).toBeCalledWith('Duplicated Username :), safi ghyrha');
        });
    });
});
