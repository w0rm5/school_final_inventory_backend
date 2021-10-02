import RequestLog from "../models/request_log.js";
import { meta } from "../utils/enum.js";

export async function logRequests(req, res, next) {
  let { url, method, headers, params, query, body, userInfo } = req;
  console.log(url, method, headers, params, query, body, userInfo);
  RequestLog.create(
    { url, method, headers, params, query, body, userInfo },
    (err) => {
      if (err) {
        res
          .status(meta.INTERNAL_ERROR)
          .json({ meta: meta.INTERNAL_ERROR, message: "loggin error: " + err.message });
        return;
      }
      next();
    }
  );
}
