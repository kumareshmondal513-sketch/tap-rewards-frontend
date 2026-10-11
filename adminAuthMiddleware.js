import {
  getAdminAuth,
  hasAdminPermission
} from './adminAuthService.js';

// অ্যাডমিনের পরিচয় ও অনুমতি যাচাই
export function requireAdmin(permission = null) {
  return async function (req, res, next) {
    try {
      // এই পরিচয়টি শুধু Telegram initData
      // যাচাই করা middleware থেকে আসা উচিত।
      const adminId = req.auth?.telegramUserId;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'অ্যাডমিনের পরিচয় যাচাই হয়নি'
        });
      }

      const admin = await getAdminAuth(adminId);

      if (!admin) {
        return res.status(403).json({
          success: false,
          message: 'অ্যাকাউন্টটি অ্যাডমিন নয় বা সক্রিয় নেই'
        });
      }

      if (permission) {
        const allowed = await hasAdminPermission({
          adminId,
          permission
        });

        if (!allowed) {
          return res.status(403).json({
            success: false,
            message: 'এই কাজের অনুমতি নেই'
          });
        }
      }

      req.admin = admin;
      return next();
    } catch (error) {
      console.error(
        'Admin middleware error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message: 'অ্যাডমিন যাচাই করতে সমস্যা হয়েছে'
      });
    }
  };
}