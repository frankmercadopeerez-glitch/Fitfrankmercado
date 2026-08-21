(function () {
  "use strict";

  var config = window.FMF_CONFIG || {};
  var lang = document.documentElement.lang === "es-US" ? "es" : "en";

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var menuButton = document.querySelector("[data-menu-button]");
  var menu = document.querySelector("[data-menu]");
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  var checkoutMap = {
    free: config.freeGuideUrl,
    personal: config.personalPlanPaymentUrl
  };

  document.querySelectorAll("[data-checkout]").forEach(function (link) {
    var checkoutType = link.getAttribute("data-checkout");
    var checkoutUrl = checkoutMap[checkoutType] || "";
    var checkoutEnabled = checkoutType === "personal"
      ? config.personalPlanPaymentEnabled === true
      : config.freeCheckoutEnabled === true;
    var isPending = !checkoutEnabled || !checkoutUrl || checkoutUrl.indexOf("REPLACE_") !== -1;

    if (isPending) {
      var subject = checkoutType === "personal"
        ? (lang === "es" ? "Consulta sobre mi plan personalizado" : "Question about my custom training plan")
        : (lang === "es" ? "Quiero la guía gratuita ShiftStarter" : "I want the free ShiftStarter guide");
      link.href = "mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "?subject=" + encodeURIComponent(subject);
      link.setAttribute("data-checkout-pending", "true");
      link.textContent = checkoutType === "personal"
        ? (lang === "es" ? "Consultar antes de pagar" : "Ask before paying")
        : (lang === "es" ? "Avísame cuando abra la descarga" : "Tell me when downloads open");
    } else {
      link.href = checkoutUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector("script[data-paypal-sdk]");
      if (existing) {
        if (window.paypal) resolve();
        else existing.addEventListener("load", resolve, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-paypal-sdk", "true");
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function encodePaymentHandoff(value) {
    var bytes = new TextEncoder().encode(JSON.stringify(value));
    var binary = "";
    bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodePaymentHandoff(value) {
    try {
      var base64 = value.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      var binary = atob(base64);
      var bytes = Uint8Array.from(binary, function (char) { return char.charCodeAt(0); });
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (_) {
      return null;
    }
  }

  var paypalArea = document.querySelector("[data-paypal-checkout]");
  if (paypalArea) {
    var paypalButtons = paypalArea.querySelector("[data-paypal-buttons]");
    var paypalStatus = paypalArea.querySelector("[data-paypal-status]");
    var fallback = document.querySelector("[data-paypal-fallback]");
    window.fetch(config.paypalApiCheckoutUrl || "/api/paypal-config", { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("Checkout configuration unavailable");
        return response.json();
      }).then(function (paymentConfig) {
        if (!paymentConfig.enabled || !paymentConfig.clientId) throw new Error("Checkout not active");
        var sdk = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(paymentConfig.clientId)
          + "&currency=" + encodeURIComponent(paymentConfig.currency)
          + "&intent=capture&components=buttons";
        return loadScript(sdk).then(function () {
          if (!window.paypal || !window.paypal.Buttons) throw new Error("PayPal SDK unavailable");
          if (fallback) fallback.hidden = true;
          paypalArea.hidden = false;
          if (paypalStatus) {
            paypalStatus.hidden = false;
            paypalStatus.textContent = lang === "es"
              ? "Pago seguro de $19 USD procesado por PayPal."
              : "Secure $19 USD payment processed by PayPal.";
          }
          return window.paypal.Buttons({
            style: { layout: "vertical", shape: "rect", label: "paypal", height: 48 },
            createOrder: function () {
              return window.fetch(config.paypalCreateOrderUrl || "/api/paypal-create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: "{}"
              }).then(function (response) {
                if (!response.ok) throw new Error("Order creation failed");
                return response.json();
              }).then(function (order) { return order.id; });
            },
            onApprove: function (data) {
              if (paypalStatus) paypalStatus.textContent = lang === "es" ? "Confirmando tu pago…" : "Confirming your payment…";
              return window.fetch(config.paypalCaptureOrderUrl || "/api/paypal-capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ orderId: data.orderID })
              }).then(function (response) {
                if (!response.ok) throw new Error("Payment capture failed");
                return response.json();
              }).then(function (result) {
                var handoff = encodePaymentHandoff({
                  orderId: result.orderId,
                  captureId: result.captureId,
                  payerEmail: result.payerEmail,
                  verificationToken: result.verificationToken
                });
                window.location.assign((lang === "es" ? "/es-us/formulario/" : "/intake/") + "#payment=" + handoff);
              });
            },
            onCancel: function () {
              if (paypalStatus) paypalStatus.textContent = lang === "es" ? "El pago no se completó." : "The payment was not completed.";
            },
            onError: function () {
              if (paypalStatus) paypalStatus.textContent = lang === "es"
                ? "PayPal no pudo completar el proceso. Inténtalo de nuevo."
                : "PayPal could not complete the process. Please try again.";
            }
          }).render(paypalButtons);
        });
      }).catch(function () {
        paypalArea.hidden = true;
        if (fallback) fallback.hidden = false;
      });
  }

  var intakeForm = document.querySelector("[data-intake-form]");
  if (intakeForm) {
    var endpoint = config.verifiedIntakeUrl || "/api/intake";
    var enabled = config.intakeEnabled === true;
    var submitButton = intakeForm.querySelector("button[type='submit']");
    var status = document.querySelector("[data-intake-status]");
    var handoffMatch = window.location.hash.match(/^#payment=([A-Za-z0-9_-]+)$/);
    var handoff = handoffMatch ? decodePaymentHandoff(handoffMatch[1]) : null;
    var orderField = intakeForm.querySelector("[name='paypal_order_id']");
    var captureField = intakeForm.querySelector("[name='paypal_capture_id']");
    var tokenField = intakeForm.querySelector("[name='payment_verification_token']");
    var payerEmailField = intakeForm.querySelector("[name='paypal_payer_email']");
    if (handoff && handoff.orderId && handoff.captureId && handoff.verificationToken) {
      if (orderField) orderField.value = handoff.orderId;
      if (captureField) captureField.value = handoff.captureId;
      if (tokenField) tokenField.value = handoff.verificationToken;
      if (payerEmailField && handoff.payerEmail) payerEmailField.value = handoff.payerEmail;
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      if (status) {
        status.hidden = false;
        status.innerHTML = lang === "es"
          ? "<strong>Pago confirmado.</strong><p>Completa el formulario para que pueda preparar tu plan.</p>"
          : "<strong>Payment confirmed.</strong><p>Complete the intake so I can prepare your plan.</p>";
      }
    } else {
      enabled = false;
      if (status) {
        status.hidden = false;
        status.innerHTML = lang === "es"
          ? "<strong>Primero completa el pago seguro.</strong><p>Regresa a <a href='/es-us/programa/'>la página del plan</a>; el formulario se habilitará automáticamente después de la confirmación de PayPal.</p>"
          : "<strong>Complete secure payment first.</strong><p>Return to <a href='/program/'>the plan page</a>; this intake unlocks automatically after PayPal confirms the payment.</p>";
      }
    }

    if (enabled) {
      intakeForm.action = endpoint;
      intakeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!intakeForm.reportValidity()) return;

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = lang === "es" ? "Enviando solicitud…" : "Sending request…";
        }
        if (status) {
          status.hidden = false;
          status.innerHTML = lang === "es"
            ? "<strong>Enviando tu formulario de forma segura…</strong>"
            : "<strong>Sending your intake securely…</strong>";
        }

        var payload = {};
        new FormData(intakeForm).forEach(function (value, key) { payload[key] = value; });
        window.fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json", Accept: "application/json" }
        }).then(function (response) {
          if (!response.ok) throw new Error("Form submission failed");
          window.location.assign(lang === "es" ? "/es-us/gracias/" : "/thanks/");
        }).catch(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = lang === "es" ? "Enviar mi formulario de forma segura" : "Submit my intake securely";
          }
          if (status) {
            status.hidden = false;
            status.innerHTML = lang === "es"
              ? "<strong>No se pudo enviar.</strong><p>Revisa tu conexión e inténtalo una vez más. Si continúa, escribe a <a href='mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "'>soporte</a>.</p>"
              : "<strong>Submission did not go through.</strong><p>Check your connection and try once more. If it continues, <a href='mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "'>email support</a>.</p>";
          }
        });
      });
    } else {
      intakeForm.action = "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = lang === "es" ? "Pago requerido para continuar" : "Payment required to continue";
      }
    }
  }

  document.querySelectorAll("a[target='_blank']").forEach(function (link) {
    var rel = (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    ["noopener", "noreferrer"].forEach(function (value) {
      if (rel.indexOf(value) === -1) rel.push(value);
    });
    link.setAttribute("rel", rel.join(" "));
  });

  var bmiForm = document.querySelector("[data-bmi-form]");
  if (bmiForm) {
    var unitButtons = Array.from(bmiForm.querySelectorAll("[data-unit]"));
    var metricFields = bmiForm.querySelector("[data-metric-fields]");
    var imperialFields = bmiForm.querySelector("[data-imperial-fields]");
    var unit = "metric";

    function setUnit(nextUnit) {
      unit = nextUnit;
      unitButtons.forEach(function (button) {
        var active = button.getAttribute("data-unit") === unit;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      if (metricFields && imperialFields) {
        metricFields.hidden = unit !== "metric";
        imperialFields.hidden = unit !== "imperial";
      }
    }

    unitButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setUnit(button.getAttribute("data-unit"));
      });
    });

    bmiForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var adult = bmiForm.querySelector("[name='adult']");
      var result = document.querySelector("[data-bmi-result]");
      if (!result) return;

      if (!adult || !adult.checked) {
        result.hidden = false;
        result.innerHTML = "<strong>" + (lang === "es" ? "Esta herramienta es solo para adultos de 20 años o más." : "This tool is only for adults age 20 or older.") + "</strong>";
        return;
      }

      var bmi;
      if (unit === "metric") {
        var kilograms = Number(bmiForm.elements.kilograms.value);
        var centimeters = Number(bmiForm.elements.centimeters.value);
        bmi = kilograms / Math.pow(centimeters / 100, 2);
      } else {
        var pounds = Number(bmiForm.elements.pounds.value);
        var feet = Number(bmiForm.elements.feet.value);
        var inches = Number(bmiForm.elements.inches.value);
        var totalInches = feet * 12 + inches;
        bmi = 703 * pounds / Math.pow(totalInches, 2);
      }

      if (!Number.isFinite(bmi) || bmi < 10 || bmi > 80) {
        result.hidden = false;
        result.innerHTML = "<strong>" + (lang === "es" ? "Revisa los valores e inténtalo de nuevo." : "Check your values and try again.") + "</strong>";
        return;
      }

      var category;
      if (bmi < 18.5) category = lang === "es" ? "por debajo del rango de referencia" : "below the reference range";
      else if (bmi < 25) category = lang === "es" ? "dentro del rango de referencia" : "within the reference range";
      else if (bmi < 30) category = lang === "es" ? "por encima del rango de referencia" : "above the reference range";
      else category = lang === "es" ? "en el rango de obesidad para detección" : "in the obesity screening range";

      result.hidden = false;
      result.innerHTML = lang === "es"
        ? "<span class='tool-result-number'>" + bmi.toFixed(1) + "</span><strong>Tu IMC está " + category + ".</strong><p>Es una medida de detección, no un diagnóstico. No distingue grasa, músculo ni distribución corporal. Coméntalo con un profesional de salud si te preocupa.</p>"
        : "<span class='tool-result-number'>" + bmi.toFixed(1) + "</span><strong>Your BMI is " + category + ".</strong><p>It is a screening measure, not a diagnosis. It does not distinguish fat, muscle, or fat distribution. Discuss it with a healthcare professional if you are concerned.</p>";
    });
  }

  var plannerForm = document.querySelector("[data-planner-form]");
  if (plannerForm) {
    plannerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var days = Number(plannerForm.elements.days.value);
      var minutes = Number(plannerForm.elements.minutes.value);
      var equipment = plannerForm.elements.equipment.value;
      var shift = plannerForm.elements.shift.value;
      var output = document.querySelector("[data-planner-result]");
      if (!output) return;

      var splitEn = days === 2 ? "Two full-body sessions" : days === 3 ? "Three full-body sessions" : "Two upper-body and two lower-body sessions";
      var splitEs = days === 2 ? "Dos sesiones de cuerpo completo" : days === 3 ? "Tres sesiones de cuerpo completo" : "Dos sesiones de torso y dos de tren inferior";
      var equipmentEn = equipment === "none" ? "bodyweight movements" : equipment === "dumbbells" ? "bodyweight plus dumbbells" : "basic gym equipment";
      var equipmentEs = equipment === "none" ? "movimientos con peso corporal" : equipment === "dumbbells" ? "peso corporal y mancuernas" : "equipo básico de gimnasio";
      var shiftTipsEn = {
        rotating: "Choose your training days after each rota is published. Keep at least one recovery day after two consecutive sessions.",
        early: "Train after work or before your evening meal. Avoid cutting sleep to force a morning session.",
        late: "Train after waking or at least two hours before your shift when possible.",
        standard: "Anchor sessions to three repeatable calendar blocks and keep one backup window."
      };
      var shiftTipsEs = {
        rotating: "Elige tus días de entrenamiento cuando publiquen cada turno. Deja al menos un día de recuperación después de dos sesiones seguidas.",
        early: "Entrena después del trabajo o antes de la cena. No sacrifiques sueño para forzar una sesión matutina.",
        late: "Entrena al despertar o al menos dos horas antes del turno cuando sea posible.",
        standard: "Fija las sesiones en bloques repetibles del calendario y conserva una ventana de respaldo."
      };

      output.hidden = false;
      output.innerHTML = lang === "es"
        ? "<span class='eyebrow'>Tu punto de partida</span><h3>" + splitEs + " de " + minutes + " minutos</h3><p>Usa " + equipmentEs + ". " + shiftTipsEs[shift] + "</p><p class='small'>Empieza con intensidad moderada, deja 2–3 repeticiones posibles al final de cada serie y aumenta solo cuando la técnica sea estable.</p>"
        : "<span class='eyebrow'>Your starting point</span><h3>" + splitEn + " at " + minutes + " minutes each</h3><p>Use " + equipmentEn + ". " + shiftTipsEn[shift] + "</p><p class='small'>Begin at a moderate effort, leave 2–3 possible repetitions at the end of each set, and progress only when technique is steady.</p>";
    });
  }
})();
