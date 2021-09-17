import bcrypt from 'bcrypt';
import { Request, NextFunction, Response } from 'express';
import { config } from '../config.js';

export const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
	if (
		req.method === 'GET' ||
		req.method === 'OPTIONS' ||
		req.method === 'HEAD'
	) {
		return next();
	}

	const csrfHeader = req.get('dwitter-csrf-token');

	if (!csrfHeader) {
		console.warn(
			'Missing required "dwitter-csrf-token" header.',
			req.headers.origin
		);
		return res.status(403).json({ message: 'Failed CSRF check' });
	}
	validateCsrfToken(csrfHeader)
		.then((valid): Response | undefined => {
			if (!valid) {
				console.warn(
					'Value provided in "dwitter-csrf-token" header does not validate',
					req.headers.origin,
					csrfHeader
				);
				return res.status(403).json({ message: 'Failed CSRF check' });
			}
			next();
		})
		.catch((err): Response => {
			console.log(err);
			return res.status(500).json({ message: 'Something went wrong' });
		});
};

async function validateCsrfToken(csrfToken: string): Promise<boolean> {
	return bcrypt.compare(config.csrf.plainToken, csrfToken);
}
