import RequestLog from "../models/request_log.js";
import { meta } from "../utils/enum.js";

export async function logRequests(req, res, next) {
  let { originalUrl, method, headers, body, userInfo } = req;
  RequestLog.create(
    { url : originalUrl, method, headers, body, userInfo },
    (err) => {
      if (err) {
        res
          .status(meta.INTERNAL_ERROR)
          .json({ meta: meta.INTERNAL_ERROR, message: "logging error: " + err.message });
        return;
      }
      next();
    }
  );
}
