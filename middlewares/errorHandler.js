const errorHandler = (err, req, res, next) => {
  // 디버깅용: 에러 전체를 로그에 남김
  if (process.env.NODE_ENV !== 'production') {
    console.error('==== API Error ====');
    console.error('Message:', err.message);
    if (err.stack) console.error('Stack:', err.stack);
    if (err.code) console.error('Code:', err.code);
    console.error('===================');
  }

  let statusCode = 500;
  let message = '서버 오류 발생!';

  // 1. Zod 에러: 요청 본문이나 쿼리 유효성 검사 실패
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.issues.map((e) => e.message).join(', ');
  }
  // 2. Express-validator 에러
  else if (Array.isArray(err.errors)) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }
  // 3. Prisma 클라이언트 에러
  else if (err.code) {
    switch (err.code) {
      case 'P2025':
        statusCode = 404;
        message = 'P2025! 리소스를 찾지 못 했어요.';
        break;
      case 'P2002':
        statusCode = 409;
        message = 'P2002! 이미 존재하는 데이터예요!';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'P2003! 참조 무결성 오류예요.';
        break;
      case 'P2004':
        statusCode = 500;
        message = 'P2004! 트랜잭션 실패!';
        break;
      default:
        statusCode = 500;
        message = '데이터베이스 오류예요.';
    }
  }

  // 콘솔링용
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Message:', message);
  }

  // 최종 응답 전송
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
