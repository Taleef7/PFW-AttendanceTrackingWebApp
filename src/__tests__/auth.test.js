import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import { signup } from '../services/authService';
import { initializeAuth, connectAuthEmulator } from 'firebase/auth';
import { getApp, initializeApp } from 'firebase/app';

jest.mock('firebase/auth', () => {
    const originalModule = jest.requireActual('firebase/auth');

    const MockUser = function (userInit, stsTokenManager, auth) {
        Object.assign(this, userInit);
        this.stsTokenManager = stsTokenManager;
        this.auth = auth;
        this._stopProactiveRefresh = jest.fn();
        this.getIdToken = jest.fn().mockResolvedValue("fake-id-token");
        this.reload = jest.fn().mockResolvedValue();
        this.toJSON = jest.fn().mockReturnValue({});
    };

    return {
        ...originalModule,
        createUserWithEmailAndPassword: jest.fn(),
        sendEmailVerification: jest.fn(),
        User: MockUser,
    };
});

console.log = jest.fn();

describe('signup', () => {
    let auth;
    let app;

    beforeAll(async () => {
        app = initializeApp({
            apiKey: 'fake-api-key',
            authDomain: 'fake-project.firebaseapp.com',
            projectId: 'fake-project',
        });
        auth = initializeAuth(app, {
            persistence: null,
        });
        connectAuthEmulator(auth, 'http://localhost:9099');
    });

    afterAll(async () => {
        await auth.signOut();
    });

    it('should create a user and send a verification email', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const mockUser = new (require('firebase/auth').User)(
            {
                providerId: 'password',
                uid: 'test-uid',
                email: email,
            },
            {
                stsTokenManager: {
                    accessToken: 'fake-access-token',
                    expirationTime: Date.now() + 3600000,
                    refreshToken: 'fake-refresh-token',
                },
                apiKey: 'fake-api-key',
                authDomain: 'fake-project.firebaseapp.com',
            },
            auth
        );

        createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
        sendEmailVerification.mockResolvedValue();

        await signup(email, password);

        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(sendEmailVerification).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Verification email sent!');

        const resolvedUser = (await createUserWithEmailAndPassword(email, password)).user;
        expect(resolvedUser.email).toBe(email);
    });

    it('should throw an error if signup fails', async () => {
        const email = 'invalid-email';
        const password = 'short';

        createUserWithEmailAndPassword.mockRejectedValue(new Error('Firebase Error'));

        await expect(signup(email, password)).rejects.toThrow();
    });

    it('should properly handle firebase errors', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        createUserWithEmailAndPassword.mockRejectedValue(new Error('Firebase Error'));

        await expect(signup(email, password)).rejects.toThrow('Firebase Error');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});