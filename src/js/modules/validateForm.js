import Joi from 'joi';
export class ValidateForm {

  /**
   * Array of setting for valid each form
   * @type {{name: *, comment: *, email: *}}
   */
  schema = {
    name: Joi.string()
      .min(2)
      .required()
      .messages({
        'string.empty': 'Поле является обязательным',
        'string.min': 'Длиной не менее 2 символов'
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Недопустимый формат',
        'string.empty': 'Поле является обязательным',
      }),
    comment: Joi.string().allow('')
  }

  /**
   * Change field for errors
   * @param input
   * @param domErr
   */
  changeFieldForError (input, domErr) {
    if (!input.parentNode.querySelector('div.invalid-feedback')) {
      input.parentNode.append(domErr);
    } else {
      input.parentNode.querySelector('div.invalid-feedback').remove();
      input.parentNode.append(domErr);
    }
  }

  /**
   * Show and handle of error
   * @param errors
   * @param input
   * @param form
   */
  displayErrors (errors, input, form = false) {
    let Form = form ? input : input.closest('form');
    let btn = Form.querySelector('button');
    let isInvalid = false;
    Array.from(Form.elements).forEach((item) => {
      if (errors !== undefined) {
        let domErr = document.createElement('div');
        domErr.classList.add('invalid-feedback');
        if (form) {
          for (let errKey of errors.details) {
            if (errKey.path[0] === item.name) {
              domErr.textContent = errKey.message;
              item.classList.add('is-invalid');
              this.changeFieldForError(item, domErr);
              break;
            } else {
              if (form) {
                item.classList.remove('is-invalid');
              }
            }
          }
          isInvalid = true;
        } else {
          if (errors.details[0].path[0] === item.name) {
            domErr.textContent = errors.details[0].message;
            item.classList.add('is-invalid');
            this.changeFieldForError(item, domErr);
            isInvalid = true;
          }
        }
      } else {
        if (form) {
          if (item.parentNode.querySelector('div.invalid-feedback')) {
            item.parentNode.querySelector('div.invalid-feedback').remove();
          }
          isInvalid = false;
          item.classList.remove('is-invalid');
        } else {
          if (input.parentNode.querySelector('div.invalid-feedback')) {
            input.parentNode.querySelector('div.invalid-feedback').remove();
            input.classList.remove('is-invalid');
          }
          if (item.classList.contains('is-invalid')) {
            isInvalid = true;
          }
        }
      }
    });
    btn.disabled = isInvalid;
  }

  /**
   * Create object for valid
   * @returns {{}}
   * @param arrInput
   * @param form
   * @param schema
   */
  getObjByInputs (arrInput, form = false, schema = true) {
    let obj = {};
    if (form) {
      let formData = new FormData(arrInput);
      for (let input of formData.entries()) {
        obj[input[0]] = schema ? this.schema[input[0]]: input[1]
      }
    } else {
      obj[arrInput.name] = schema ? this.schema[arrInput.name] : arrInput.value
    }
    return obj;
  }

  /**
   * Valid form and output errors
   * @param arrInput
   * @param form
   */
  valid (arrInput, form = false) {
    try {
      const valid = Joi.object(this.getObjByInputs(arrInput, form, true))
        .validate(this.getObjByInputs(arrInput, form, false), {abortEarly: !form });
      throw valid.error;
    } catch (err) {
      this.displayErrors(err, arrInput, form);
    }
  }

  /**
   * Action form
   */
  actionForm () {
    const forms = document.getElementsByClassName("form-validate");
    Array.from(forms).forEach((form) => {
      Array.from(form).forEach((item) => {
        item.addEventListener('keyup', () => {
          this.valid(item, false);
        })
        if (item.classList.contains('btn')) {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            this.valid(form, true);
          })
        }
      });
    });
  }
}
