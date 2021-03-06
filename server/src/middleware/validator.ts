import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 유효성 검사 결과 로직
export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	console.log('Verification', errors);
	if (errors.isEmpty()) {
		return next();
	}
	return res.status(400).json({ message: errors.array()[0].msg });
};
