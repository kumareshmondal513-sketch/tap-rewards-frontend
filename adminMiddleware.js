import {
  isAdmin,
  isMainAdmin,
  getAdminPermissions
} from './adminService.js';


// =====================================
// GET TELEGRAM ID FROM REQUEST
// =====================================

function getTelegramId(req) {
  return (
    req.headers['x-telegram-id'] ||
    req.body?.telegramId ||
    req.query?.telegramId ||
    req.params?.telegramId ||
    null
  );
}


// =====================================
// REQUIRE ADMIN
// =====================================

export async function requireAdmin(
  req,
  res,
  next
) {
  try {
    const telegramId =
      getTelegramId(req);

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          'Telegram ID is required.'
      });
    }

    const adminAccess =
      await isAdmin(
        String(telegramId)
      );

    if (!adminAccess) {
      return res.status(403).json({
        success: false,
        message:
          'Admin access denied.'
      });
    }

    req.adminTelegramId =
      String(telegramId);

    req.isMainAdmin =
      isMainAdmin(
        String(telegramId)
      );

    req.adminPermissions =
      await getAdminPermissions(
        String(telegramId)
      );

    next();
  } catch (error) {
    console.error(
      'Admin middleware error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        'Admin authorization failed.'
    });
  }
}


// =====================================
// REQUIRE MAIN ADMIN
// =====================================

export async function requireMainAdmin(
  req,
  res,
  next
) {
  try {
    const telegramId =
      getTelegramId(req);

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          'Telegram ID is required.'
      });
    }

    if (
      !isMainAdmin(
        String(telegramId)
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Main Admin access required.'
      });
    }

    req.adminTelegramId =
      String(telegramId);

    req.isMainAdmin = true;

    req.adminPermissions =
      await getAdminPermissions(
        String(telegramId)
      );

    next();
  } catch (error) {
    console.error(
      'Main admin middleware error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        'Main Admin authorization failed.'
    });
  }
}


// =====================================
// REQUIRE PERMISSION
// =====================================

export function requirePermission(
  permission
) {
  return async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.adminTelegramId ||
        getTelegramId(req);

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            'Telegram ID is required.'
        });
      }

      const adminAccess =
        await isAdmin(
          String(telegramId)
        );

      if (!adminAccess) {
        return res.status(403).json({
          success: false,
          message:
            'Admin access denied.'
        });
      }

      const mainAdmin =
        isMainAdmin(
          String(telegramId)
        );

      if (mainAdmin) {
        req.adminTelegramId =
          String(telegramId);

        req.isMainAdmin = true;

        return next();
      }

      const permissions =
        await getAdminPermissions(
          String(telegramId)
        );

      if (
        permissions[permission] !== true
      ) {
        return res.status(403).json({
          success: false,
          message:
            `Permission denied: ${permission}`
        });
      }

      req.adminTelegramId =
        String(telegramId);

      req.isMainAdmin = false;
      req.adminPermissions =
        permissions;

      next();
    } catch (error) {
      console.error(
        'Permission middleware error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          'Permission verification failed.'
      });
    }
  };
}


// =====================================
// PREVENT MAIN ADMIN MODIFICATION
// =====================================

export function preventMainAdminModification(
  req,
  res,
  next
) {
  try {
    const targetTelegramId =
      req.params?.telegramId ||
      req.body?.telegramId;

    if (
      targetTelegramId &&
      isMainAdmin(
        String(targetTelegramId)
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Main Admin cannot be modified or removed.'
      });
    }

    next();
  } catch (error) {
    console.error(
      'Main admin protection error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        'Main Admin protection failed.'
    });
  }
}