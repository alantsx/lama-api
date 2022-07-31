import { number, object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'Username is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Email is invalid'),
        password: string({
            required_error: 'Password is required'
        }).min(8, 'Password too short - Should be at least 8 characters long'),
        passwordConfirmation: string({
            required_error: 'Password confirmation is required'
        }),
        phone: string({
            required_error: 'Phone is required'
        }),
        crypto: number({
            required_error: 'Couldnt generate crypto wallet'
        }),
        fiat: number({
            required_error: 'Couldnt generate fiat wallet'
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    })
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'crypto' | 'fiat' | 'body.passwordConfirmation'>;