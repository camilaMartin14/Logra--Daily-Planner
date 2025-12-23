CREATE DATABASE Logra_DB;
GO

USE Logra_DB;
GO

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseniaHash VARCHAR(255) NOT NULL,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE dias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuarioId INT NOT NULL,
    fecha DATE NOT NULL,
    mood VARCHAR(20) CHECK (mood IN ('happy', 'neutral', 'sad')),
    notaDia VARCHAR(500),
    notaManiana VARCHAR(500),

    CONSTRAINT fk_dias_usuario FOREIGN KEY (usuarioId)
    REFERENCES usuarios(id),
    CONSTRAINT uq_usuario_fecha UNIQUE (usuarioId, fecha)
);
GO

CREATE TABLE tareas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    diaId INT NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    realizada BIT NOT NULL DEFAULT 0,
    fechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_tareas_dia FOREIGN KEY (diaId)
    REFERENCES dias(id)
);
GO


ALTER TABLE dias
ADD aguaConsumida INT NOT NULL DEFAULT 0
CHECK (aguaConsumida BETWEEN 0 AND 8);
GO

ALTER TABLE dias
ADD horasSueno INT
CHECK (horasSueno BETWEEN 0 AND 12);
GO

ALTER TABLE dias
ADD desayuno VARCHAR(200),
    almuerzo VARCHAR(200),
    cena VARCHAR(200),
    snack VARCHAR(200)
GO

