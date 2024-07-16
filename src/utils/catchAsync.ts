const catchAsync = (fn: (req: any, res: any, next: any) => Promise<void>) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

export { catchAsync }
