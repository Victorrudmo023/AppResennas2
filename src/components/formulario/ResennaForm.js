import { useState, useRef } from "react";
import { postResenna } from "../../api/resennaApi";
import './resennasform.css'

const ResennnaForm = ({onSaveResennna}) => {

    const [inputValue, setInputValue] = useState({
        titulo: "",
        lugar: "",
        marca: "",
        num: "",
        latitud: "",
        longitud: "",
        elevElip: "",
        elevOrto: "",
        x: "",
        y: "",
        fecha: "",
        logo: null,
        imagenSituacion: null,
        imagenDetalle: null,
        imagenGeneral: null,
    
    });
    const [errors, setErrors] = useState({
        titulo: {error: false, message: ""},
        lugar: {error: false, message: ""},
        marca: {error: false, message: ""},
        num: {error: false, message: ""},
        latitud: {error: false, message: ""},
        longitud: {error: false, message: ""},
        elevElip: {error: false, message: ""},
        elevOrto: {error: false, message: ""},
        x: {error: false, message: ""},
        y: {error: false, message: ""},
        fecha: {error: false, message: ""},
        logo: {error: false, message: ""},
        imagenSituacion: {error: false, message: ""},
        imagenDetalle: {error: false, message: ""},
        imagenGeneral: {error: false, message: ""},
       
    });

    const [serverError, setServerError] = useState({error: false, message: ""});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const titleRef = useRef();

    const resetForm = () => {
        setInputValue({
            ...inputValue,
            num: "",
            latitud: "",
            longitud: "",
            elevElip: "",
            elevOrto: "",
            x: "",
            y: "",
            imagenSituacion: null,
            imagenDetalle: null,
            imagenGeneral: null,
        });
        setErrors({
            ...errors,
            num: { error: false, message: "" },
            latitud: { error: false, message: "" },
            longitud: { error: false, message: "" },
            elevElip: { error: false, message: "" },
            elevOrto: { error: false, message: "" },
            x: { error: false, message: "" },
            y: { error: false, message: "" },
            imagenSituacion: { error: false, message: "" },
            imagenDetalle: { error: false, message: "" },
            imagenGeneral: { error: false, message: "" },
        });
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (inputValue.titulo.length > 0 && inputValue.lugar.length > 0 && inputValue.marca.length > 0 && inputValue.num.length > 0 && inputValue.latitud.length > 0 && inputValue.longitud.length > 0 && inputValue.elevElip.length > 0 && inputValue.elevOrto.length > 0 && inputValue.x.length > 0 && inputValue.y.length > 0 && inputValue.fecha.length > 0) {
            
            // Validar latitud y longitud con el patrón
            const latPattern = /^-?\d{1,3}°\s\d{1,2}'\s\d{1,2}\.\d{1,5}"\s[NS]$/;
            const lonPattern = /^-?\d{1,3}°\s\d{1,2}'\s\d{1,2}\.\d{1,5}"\s[WE]$/;
            const isLatValid = latPattern.test(inputValue.latitud);
            const isLonValid = lonPattern.test(inputValue.longitud);

            if (!isLatValid || !isLonValid) {
                setErrors({
                    ...errors,
                    latitud: { error: !isLatValid, message: isLatValid ? "" : "Formato incorrecto. Debe seguir el patrón: 1° 1' 1.11111\" N/S" },
                    longitud: { error: !isLonValid, message: isLonValid ? "" : "Formato incorrecto. Debe seguir el patrón: 1° 1' 1.11111\" W/E" }
                });
                return;
            }
            
            const response = await postResenna(inputValue);
            if (!response.error) {
                onSaveResennna(response.data);
                resetForm();
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false); // Ocultar el mensaje después de 3 segundos
                  }, 3000);
            } else {
                setServerError({ error: true, message: "No se pudo guardar la reseña" });
            }
        } else {
            
            setErrors({
                titulo: { error: inputValue.titulo.length === 0, message: "Este campo es obligatorio" },
                lugar: { error: inputValue.lugar.length === 0, message: "Este campo es obligatorio" },
                marca: { error: inputValue.marca.length === 0, message: "Este campo es obligatorio" },
                num: { error: inputValue.num.length === 0, message: "Este campo es obligatorio" },
                latitud: { error: inputValue.latitud.length === 0, message: "Este campo es obligatorio" },
                longitud: { error: inputValue.longitud.length === 0, message: "Este campo es obligatorio" },
                elevElip: { error: inputValue.elevElip.length === 0, message: "Este campo es obligatorio" },
                elevOrto: { error: inputValue.elevOrto.length === 0, message: "Este campo es obligatorio" },
                x: { error: inputValue.x.length === 0, message: "Este campo es obligatorio" },
                y: { error: inputValue.y.length === 0, message: "Este campo es obligatorio" },
                fecha: { error: inputValue.fecha.length === 0, message: "Este campo es obligatorio" },
                logo: errors.logo,
                imagenSituacion: errors.imagenSituacion, 
                imagenDetalle: errors.imagenDetalle, 
                imagenGeneral: errors.imagenGeneral, 
            });
        }
    }
    
    const handleChange = (event) => {
        let {name, value} = event.target;
        console.log(name, value);
        switch (name) {
            case "titulo":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        titulo: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        titulo: {error: false, message: ""}
                    })
                }
                break;
            
            case "lugar":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        lugar: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        lugar: {error: false, message: ""}
                    })
                }
                break;
            
            case "marca":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        marca: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        marca: {error: false, message: ""}
                    })
                }
                break;

            case "num":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        num: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        num: {error: false, message: ""}
                    })
                }
                break;    

            case "latitud":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        latitud: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        latitud: {error: false, message: ""}
                    })
                }
                break;

            case "longitud":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        longitud: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        longitud: {error: false, message: ""}
                    })
                }
                break;

            case "elevElip":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        elevElip: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        elevElip: {error: false, message: ""}
                    })
                }
                break;
                
            case "elevOrto":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        elevOrto: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        elevOrto: {error: false, message: ""}
                    })
                }
                break;
            case "x":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        x: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        x: {error: false, message: ""}
                    })
                }
                break;    
            case "y":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        y: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        y: {error: false, message: ""}
                    })
                }
                break;
            case "fecha":
                if (value.length === 0) {
                    setErrors({
                        ...errors,
                        fecha: {error: true, message: "Este campo es obligatorio"}
                    })
                } else {
                    setErrors({
                        ...errors,
                        fecha: {error: false, message: ""}
                    })
                }
                break;
            case "logo":
                break;
            case "imagenSituacion":
                break;
            case "imagenDetalle":
                break;
            case "imagenGeneral":
                break;
            default:
                break;
        }

        setInputValue({
            ...inputValue,
            [name]: value
        });
        setServerError({error: false, message: ""});
    }

    const handleFileInputChange = (event) => {
        const { name, files } = event.target;
        setInputValue({ ...inputValue, [name]: files[0] });
    };
    
    return  <form className="resennaform" onSubmit={onSubmit}>
                <div className="form-group">
                    <span className="izqAnnadir">Título</span>
                    <input className="derAnnadir" type="text"
                            name="titulo"
                            ref={titleRef}
                            value={inputValue.titulo}
                            onChange={handleChange}
                    />
                    {
                    errors.titulo.error ? 
                    <div className="error-input">{errors.titulo.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span  className="izqAnnadir">Lugar</span>
                    <input  className="derAnnadir" type="text"
                            name="lugar"
                            ref={titleRef}
                            value={inputValue.lugar}
                            onChange={handleChange}
                    />
                    {
                    errors.lugar.error ? 
                    <div className="error-input">{errors.lugar.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Marca</span>
                    <input  className="derAnnadir" type="text"
                            name="marca"
                            ref={titleRef}
                            value={inputValue.marca}
                            onChange={handleChange}
                    />
                    {
                    errors.marca.error ? 
                    <div className="error-input">{errors.marca.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Número de expediente</span>
                    <input  className="derAnnadir" type="text"
                            name="num"
                            ref={titleRef}
                            value={inputValue.num}
                            onChange={handleChange}
                    />
                    {
                    errors.num.error ? 
                    <div className="error-input">{errors.num.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Latitud</span>
                    <input className="derAnnadir" type="text"
                            name="latitud"
                            ref={titleRef}
                            value={inputValue.latitud}
                            onChange={handleChange}
                    />
                    {
                    errors.latitud.error ? 
                    <div className="error-input">{errors.latitud.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Longitud</span>
                    <input className="derAnnadir" type="text"
                            name="longitud"
                            ref={titleRef}
                            value={inputValue.longitud}
                            onChange={handleChange}
                    />
                    {
                    errors.longitud.error ? 
                    <div className="error-input">{errors.longitud.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Elev. Elipsoidal</span>
                    <input className="derAnnadir" type="text"
                            name="elevElip"
                            ref={titleRef}
                            value={inputValue.elevElip}
                            onChange={handleChange}
                    />
                    {
                    errors.elevElip.error ? 
                    <div className="error-input">{errors.elevElip.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Elev. Ortometrica EGM-08</span>
                    <input className="derAnnadir" type="text"
                            name="elevOrto"
                            ref={titleRef}
                            value={inputValue.elevOrto}
                            onChange={handleChange}
                    />
                    {
                    errors.elevOrto.error ? 
                    <div className="error-input">{errors.elevOrto.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">X</span>
                    <input className="derAnnadir" type="text"
                            name="x"
                            ref={titleRef}
                            value={inputValue.x}
                            onChange={handleChange}
                    />
                    {
                    errors.x.error ? 
                    <div className="error-input">{errors.x.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Y</span>
                    <input className="derAnnadir" type="text"
                            name="y"
                            ref={titleRef}
                            value={inputValue.y}
                            onChange={handleChange}
                    />
                    {
                    errors.y.error ? 
                    <div className="error-input">{errors.y.message}</div>
                    : null
                    }
                </div>
                <div className="form-group">
                    <span className="izqAnnadir">Fecha</span>
                    <input className="derAnnadir" type="text"
                            name="fecha"
                            ref={titleRef}
                            value={inputValue.fecha}
                            onChange={handleChange}
                    />
                    {
                    errors.fecha.error ? 
                    <div className="error-input">{errors.fecha.message}</div>
                    : null
                    }
                </div>
        
        <div className="form-group">
            <span className="izqAnnadir">Imagen Logo</span>
            <input className="derAnnadirImagen" type="file"
                name="logo"
                onChange={handleFileInputChange}
            />
            {inputValue.logo && (
                <img id='previewLogo' src={URL.createObjectURL(inputValue.logo)} alt="Imagen Logo" />
            )}
        </div>

        <div className="form-group">
            <span className="izqAnnadir">Imagen Situación</span>
            <input className="derAnnadirImagen" type="file"
                name="imagenSituacion"
                onChange={handleFileInputChange}
            />
            {inputValue.imagenSituacion && (
                <img id='preview' src={URL.createObjectURL(inputValue.imagenSituacion)} alt="Imagen Situación" />
            )}
        </div>

        <div className="form-group">
            <span className="izqAnnadir">Imagen Detalle</span>
            <input className="derAnnadirImagen" type="file"
                name="imagenDetalle"
                onChange={handleFileInputChange}
            />
            {inputValue.imagenDetalle && (
                <img id='preview' src={URL.createObjectURL(inputValue.imagenDetalle)} alt="Imagen Detalle" />
            )}
        </div>

        <div className="form-group">
            <span className="izqAnnadir">Imagen General</span>
            <input className="derAnnadirImagen" type="file"
                name="imagenGeneral"
                onChange={handleFileInputChange}
            />
            {inputValue.imagenGeneral && (
                <img id='preview' src={URL.createObjectURL(inputValue.imagenGeneral)} alt="Imagen General" />
            )}
        </div>
                <div className="form-group center">
                {showSuccessMessage && <div className="success-message">Reseña añadida correctamente</div>}
                    { serverError.error ? serverError.message: "" }
                </div>
                <div className="form-group center">
                    <button type="submit">Añadir</button>
                </div>
                <div className="error">
                </div>
            </form>
}

export default ResennnaForm;
