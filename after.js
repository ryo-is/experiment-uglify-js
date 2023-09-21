(() => {
  var e = {
    user: {
      urlRegExp: [".*"],
      data: () => ({ userId: window.CUSTOMER_ID }),
      isLoggedIn: () =>
        void 0 !== window.CUSTOMER_ID && "" !== window.CUSTOMER_ID,
      isPropsReady: () =>
        void 0 !== window.CUSTOMER_ID && "" !== window.CUSTOMER_ID,
    },
    purchase: {
      urlRegExp: ["https://shop.takii.co.jp/(s/)?cart/thanks/.*"],
      data: () => {
        var e = dataLayer.filter((e) => "ga4_purchase" === e?.event),
          e = 0 < e.length ? e[0].ga4_ecommerce : void 0;
        return {
          transactionId: e.transaction_id,
          totalAmount: Number.parseInt(e.value),
          items: e.items.map((e) => ({
            itemId: e.item_id,
            price: Number.parseInt(e.price),
            quantity: Number.parseInt(e.quantity),
          })),
        };
      },
      isPropsReady: () => {
        var e = dataLayer.filter((e) => "ga4_purchase" === e?.event);
        return void 0 !== (0 < e.length ? e[0].ga4_ecommerce : void 0);
      },
    },
    cart: {
      urlRegExp: ["https://shop.takii.co.jp/(s/)?cart/?(\\?.*)?(#.*)?$"],
      data: () => {
        var e = dataLayer.filter((e) => "ga4_view_cart" === e?.event),
          e = 0 < e.length ? e[0].ga4_ecommerce : void 0;
        return {
          totalAmount: "" !== e.value ? Number.parseInt(e.value) : 0,
          items: e.items.map((e) => {
            var n = SPSDK.$(`tr:contains("${e.item_id}") .itemname_td`),
              n = 0 < n.length ? n[0].innerText : "";
            return {
              itemId: e.item_id,
              name: n,
              price: Number.parseInt(e.price),
              quantity: Number.parseInt(e.quantity),
            };
          }),
        };
      },
      isPropsReady: () => {
        var e = dataLayer.filter((e) => "ga4_view_cart" === e?.event);
        return void 0 !== (0 < e.length ? e[0].ga4_ecommerce : void 0);
      },
    },
    login: {
      urlRegExp: [".*"],
      data: () => ({
        isLoggedIn: void 0 !== window.CUSTOMER_ID && "" !== window.CUSTOMER_ID,
      }),
      isPropsReady: () => void 0 !== window.CUSTOMER_ID,
    },
  };
  !(function () {
    "use strict";
    try {
      var e;
      "undefined" != typeof document &&
        ((e = document.createElement("style")).appendChild(
          document.createTextNode("")
        ),
        document.head.appendChild(e));
    } catch (e) {
      console.error("vite-plugin-css-injected-by-js", e);
    }
  })();
  const g = window.SPSDK.debug("custom:dataconnect");
  async function i(e) {
    const {
        id: r,
        condition: i = () => !0,
        interval: o = 500,
        retry: a = 20,
        delay: n = 0,
        trackerFunction: t = () => g("please override"),
      } = e,
      c =
        ((e = r),
        (d = i),
        (s = o),
        (u = a),
        (p = n),
        (l = t),
        "string" != typeof e || "" === e
          ? new Error(`fatal: conditionalTracker: ${e}: id is invalid: ` + e)
          : "function" != typeof d
          ? new Error(
              `fatal: conditionalTracker: ${e}: invalid parameter: ` + d
            )
          : "number" != typeof s || s < 0
          ? new Error(
              `fatal: conditionalTracker: ${e}: invalid parameter: ` + s
            )
          : "number" != typeof u || u < 0
          ? new Error(
              `fatal: conditionalTracker: ${e}: invalid parameter: ` + u
            )
          : "number" != typeof p || p < 0
          ? new Error(
              `fatal: conditionalTracker: ${e}: invalid parameter: ` + p
            )
          : "function" == typeof l ||
            new Error(
              `fatal: conditionalTracker: ${e}: invalid parameter: ` + l
            ));
    var d, s, u, p, l;
    if (c instanceof Error) throw c;
    await new Promise((n) => {
      let t = 0;
      !(function e() {
        if (!(++t > a)) {
          if (!i())
            return (
              g(`conditionalTracker: ${r}: retrying... ${t}/${a})`),
              setTimeout(e, o)
            );
          n(!0);
        }
      })();
    }),
      setTimeout(t, n);
  }
  async function o(e) {
    var n,
      t = (function (e) {
        const { urlRegExp: n, condition: t, isPropsReady: r } = e,
          i = n.some((e) => new RegExp(e).test(location.href));
        return () => (void 0 === t || t()) && i && r();
      })({
        urlRegExp: e.urlRegExp,
        condition: e.condition,
        isPropsReady: e.isPropsReady,
      }),
      r =
        e.trackerFunction ??
        ((n = e.data),
        () => {
          window.SPSDK.record("cart", n());
        });
    i({ ...e, id: "cart", condition: t, trackerFunction: r });
  }
  async function a(e) {
    var n,
      t = (function (e) {
        const { urlRegExp: n, condition: t, isPropsReady: r } = e,
          i = n.some((e) => new RegExp(e).test(location.href));
        return () => (void 0 === t || t()) && i && r();
      })({
        urlRegExp: e.urlRegExp,
        condition: e.condition,
        isPropsReady: e.isPropsReady,
      }),
      r =
        e.trackerFunction ??
        ((n = e.data),
        () => {
          window.SPSDK.record("login", n());
        });
    i({ ...e, id: "login", condition: t, trackerFunction: r });
  }
  async function c(e) {
    var n,
      t = (function (e) {
        const { urlRegExp: n, condition: t, isPropsReady: r } = e,
          i = n.some((e) => new RegExp(e).test(location.href));
        return () => (void 0 === t || t()) && i && r();
      })({
        urlRegExp: e.urlRegExp,
        condition: e.condition,
        isPropsReady: e.isPropsReady,
      }),
      r =
        e.trackerFunction ??
        ((n = e.data),
        () => {
          window.SPSDK.record("purchase", n());
        });
    i({ ...e, id: "purchase", condition: t, trackerFunction: r });
  }
  async function d(e) {
    var n,
      t = (function (e) {
        const {
            urlRegExp: n,
            condition: t,
            isPropsReady: r,
            isLoggedIn: i,
          } = e,
          o = n.some((e) => new RegExp(e).test(location.href));
        return () => (void 0 === t || t()) && o && i() && r();
      })({
        urlRegExp: e.urlRegExp,
        condition: e.condition,
        isLoggedIn: e.isLoggedIn,
        isPropsReady: e.isPropsReady,
      }),
      r =
        e.trackerFunction ??
        ((n = e.data),
        () => {
          window.SPSDK.user(n());
        });
    i({ ...e, id: "user", condition: t, trackerFunction: r });
  }
  !(async function (e) {
    var { user: n, purchase: t, login: r, cart: i } = e;
    void 0 !== n && d(n),
      void 0 !== t && c(t),
      void 0 !== i && o(i),
      void 0 !== r && a(r);
  })(e);
})();
