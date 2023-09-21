(() => {
  // ここから
  const props = {
    user: {
      urlRegExp: [".*"],
      data: () => {
        return {
          userId: window.CUSTOMER_ID,
        };
      },
      isLoggedIn: () => {
        return window.CUSTOMER_ID !== undefined && window.CUSTOMER_ID !== "";
      },
      isPropsReady: () => {
        return window.CUSTOMER_ID !== undefined && window.CUSTOMER_ID !== "";
      },
    },
    purchase: {
      urlRegExp: ["https://shop.takii.co.jp/(s/)?cart/thanks/.*"],
      data: () => {
        const purchaseEventName = "ga4_purchase";
        const eCommerceKey = "ga4_ecommerce";
        const purchaseEvent = dataLayer.filter(
          (data) => data?.event === purchaseEventName
        );
        const eCommerceAttr =
          purchaseEvent.length > 0 ? purchaseEvent[0][eCommerceKey] : undefined;
        const purchaseProps = {
          transactionId: eCommerceAttr.transaction_id,
          totalAmount: Number.parseInt(eCommerceAttr.value),
          items: eCommerceAttr.items.map((attr) => {
            return {
              itemId: attr.item_id,
              price: Number.parseInt(attr.price),
              quantity: Number.parseInt(attr.quantity),
            };
          }),
        };
        return purchaseProps;
      },
      isPropsReady: () => {
        const purchaseEventName = "ga4_purchase";
        const eCommerceKey = "ga4_ecommerce";
        const purchaseEvent = dataLayer.filter(
          (data) => data?.event === purchaseEventName
        );
        const eCommerceAttr =
          purchaseEvent.length > 0 ? purchaseEvent[0][eCommerceKey] : undefined;
        return eCommerceAttr !== undefined;
      },
    },
    cart: {
      urlRegExp: ["https://shop.takii.co.jp/(s/)?cart/?(\\?.*)?(#.*)?$"],
      data: () => {
        const viewCartEventName = "ga4_view_cart";
        const eCommerceKey = "ga4_ecommerce";
        const viewCartEvent = dataLayer.filter(
          (data) => data?.event === viewCartEventName
        );
        const eCommerceAttr =
          viewCartEvent.length > 0 ? viewCartEvent[0][eCommerceKey] : undefined;
        const cartProps = {
          totalAmount:
            eCommerceAttr.value !== ""
              ? Number.parseInt(eCommerceAttr.value)
              : 0,
          items: eCommerceAttr.items.map((attr) => {
            const itemElmsRaw = SPSDK.$(
              `tr:contains("${attr.item_id}") .itemname_td`
            );
            const itemName =
              itemElmsRaw.length > 0 ? itemElmsRaw[0].innerText : "";
            return {
              itemId: attr.item_id,
              name: itemName,
              price: Number.parseInt(attr.price),
              quantity: Number.parseInt(attr.quantity),
            };
          }),
        };
        return cartProps;
      },
      isPropsReady: () => {
        const viewCartEventName = "ga4_view_cart";
        const eCommerceKey = "ga4_ecommerce";
        const viewCartEvent = dataLayer.filter(
          (data) => data?.event === viewCartEventName
        );
        const eCommerceAttr =
          viewCartEvent.length > 0 ? viewCartEvent[0][eCommerceKey] : undefined;
        return eCommerceAttr !== undefined;
      },
    },
    login: {
      urlRegExp: [".*"],
      data: () => {
        return {
          isLoggedIn:
            window.CUSTOMER_ID !== undefined && window.CUSTOMER_ID !== "",
        };
      },
      isPropsReady: () => {
        return window.CUSTOMER_ID !== undefined;
      },
    },
  };
  // ここまで

  (function () {
    "use strict";
    try {
      if (typeof document != "undefined") {
        var e = document.createElement("style");
        e.appendChild(document.createTextNode("")),
          document.head.appendChild(e);
      }
    } catch (t) {
      console.error("vite-plugin-css-injected-by-js", t);
    }
  })();
  /*!
   * name - feature-dataconnect-1.0.0
   * commit - 2494241
   * copyright - (c) 2023 Sprocket, Inc.
   */
  const d = window.SPSDK.debug("custom:dataconnect");
  function g(n, e, t, o, r, a) {
    if (typeof n != "string" || n === "") {
      const i = `fatal: conditionalTracker: ${n}: id is invalid: ${n}`;
      return new Error(i);
    }
    if (typeof e != "function") {
      const i = `fatal: conditionalTracker: ${n}: invalid parameter: ${e}`;
      return new Error(i);
    }
    if (typeof t != "number" || t < 0) {
      const i = `fatal: conditionalTracker: ${n}: invalid parameter: ${t}`;
      return new Error(i);
    }
    if (typeof o != "number" || o < 0) {
      const i = `fatal: conditionalTracker: ${n}: invalid parameter: ${o}`;
      return new Error(i);
    }
    if (typeof r != "number" || r < 0) {
      const i = `fatal: conditionalTracker: ${n}: invalid parameter: ${r}`;
      return new Error(i);
    }
    if (typeof a != "function") {
      const i = `fatal: conditionalTracker: ${n}: invalid parameter: ${a}`;
      return new Error(i);
    }
    return !0;
  }
  async function c(n) {
    const {
        id: e,
        // トラッキングID
        condition: t = () => !0,
        // トラッキングを実行する条件
        interval: o = 500,
        // リトライ間隔
        retry: r = 20,
        // リトライ回数 処理は最大でリトライ+1回実行される
        delay: a = 0,
        // 条件が揃った後何秒待ってからトラッキング処理を実行するか
        trackerFunction: i = () => d("please override"),
        // トラッキング処理
      } = n,
      u = g(e, t, o, r, a, i);
    if (u instanceof Error) throw u;
    await new Promise((l) => {
      let s = 0;
      (function f() {
        if (!(++s > r))
          if (t()) l(!0);
          else
            return (
              d(`conditionalTracker: ${e}: retrying... ${s}/${r})`),
              setTimeout(f, o)
            );
      })();
    }),
      setTimeout(i, a);
  }
  function R(n) {
    const { urlRegExp: e, condition: t, isPropsReady: o } = n,
      r = e.some((a) => new RegExp(a).test(location.href));
    return () => (t === void 0 ? !0 : t()) && r && o();
  }
  function D(n) {
    return () => {
      window.SPSDK.record("cart", n());
    };
  }
  async function w(n) {
    const e = R({
        urlRegExp: n.urlRegExp,
        condition: n.condition,
        isPropsReady: n.isPropsReady,
      }),
      t = n.trackerFunction ?? D(n.data);
    c({
      ...n,
      id: "cart",
      condition: e,
      trackerFunction: t,
    });
  }
  function E(n) {
    const { urlRegExp: e, condition: t, isPropsReady: o } = n,
      r = e.some((a) => new RegExp(a).test(location.href));
    return () => (t === void 0 ? !0 : t()) && r && o();
  }
  function y(n) {
    return () => {
      window.SPSDK.record("login", n());
    };
  }
  async function k(n) {
    const e = E({
        urlRegExp: n.urlRegExp,
        condition: n.condition,
        isPropsReady: n.isPropsReady,
      }),
      t = n.trackerFunction ?? y(n.data);
    c({
      ...n,
      id: "login",
      condition: e,
      trackerFunction: t,
    });
  }
  function P(n) {
    const { urlRegExp: e, condition: t, isPropsReady: o } = n,
      r = e.some((a) => new RegExp(a).test(location.href));
    return () => (t === void 0 ? !0 : t()) && r && o();
  }
  function T(n) {
    return () => {
      window.SPSDK.record("purchase", n());
    };
  }
  async function m(n) {
    const e = P({
        urlRegExp: n.urlRegExp,
        condition: n.condition,
        isPropsReady: n.isPropsReady,
      }),
      t = n.trackerFunction ?? T(n.data);
    c({
      ...n,
      id: "purchase",
      condition: e,
      trackerFunction: t,
    });
  }
  function x(n) {
    const { urlRegExp: e, condition: t, isPropsReady: o, isLoggedIn: r } = n,
      a = e.some((i) => new RegExp(i).test(location.href));
    return () => (t === void 0 ? !0 : t()) && a && r() && o();
  }
  function C(n) {
    return () => {
      window.SPSDK.user(n());
    };
  }
  async function v(n) {
    const e = x({
        urlRegExp: n.urlRegExp,
        condition: n.condition,
        isLoggedIn: n.isLoggedIn,
        isPropsReady: n.isPropsReady,
      }),
      t = n.trackerFunction ?? C(n.data);
    c({
      ...n,
      id: "user",
      condition: e,
      trackerFunction: t,
    });
  }
  async function $(n) {
    const { user: e, purchase: t, login: o, cart: r } = n;
    e !== void 0 && v(e),
      t !== void 0 && m(t),
      r !== void 0 && w(r),
      o !== void 0 && k(o);
  }

  // ここから
  $(props);
  // ここまで
})();
