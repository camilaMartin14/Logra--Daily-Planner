using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Logra_API.Migrations
{
    /// <inheritdoc />
    public partial class v1_initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    email = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: false),
                    contraseniaHash = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: false),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true),
                    apellido = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true),
                    fechaRegistro = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuarios__3213E83F99FCD151", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(type: "INTEGER", nullable: false),
                    name = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: false),
                    color = table.Column<string>(type: "TEXT", unicode: false, maxLength: 7, nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.id);
                    table.ForeignKey(
                        name: "fk_categories_user",
                        column: x => x.userId,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "dias",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    fecha = table.Column<DateTime>(type: "TEXT", nullable: false),
                    mood = table.Column<string>(type: "TEXT", unicode: false, maxLength: 20, nullable: true),
                    notaDia = table.Column<string>(type: "TEXT", unicode: false, maxLength: 500, nullable: true),
                    notaManiana = table.Column<string>(type: "TEXT", unicode: false, maxLength: 500, nullable: true),
                    aguaConsumida = table.Column<int>(type: "INTEGER", nullable: false),
                    horasSueno = table.Column<int>(type: "INTEGER", nullable: true),
                    desayuno = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: true),
                    almuerzo = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: true),
                    cena = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: true),
                    snack = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__dias__3213E83FB23B1E09", x => x.id);
                    table.ForeignKey(
                        name: "fk_dias_usuario",
                        column: x => x.usuarioId,
                        principalTable: "usuarios",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "notes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    userId = table.Column<int>(type: "INTEGER", nullable: false),
                    title = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: false),
                    content = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    isArchived = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updatedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notes", x => x.id);
                    table.ForeignKey(
                        name: "fk_notes_user",
                        column: x => x.userId,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tareas",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    diaId = table.Column<int>(type: "INTEGER", nullable: false),
                    descripcion = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: false),
                    realizada = table.Column<bool>(type: "INTEGER", nullable: false),
                    fechaCreacion = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tareas__3213E83FBB528AEF", x => x.id);
                    table.ForeignKey(
                        name: "fk_tareas_dia",
                        column: x => x.diaId,
                        principalTable: "dias",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "noteCategories",
                columns: table => new
                {
                    noteId = table.Column<int>(type: "INTEGER", nullable: false),
                    categoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_noteCategories", x => new { x.noteId, x.categoryId });
                    table.ForeignKey(
                        name: "fk_noteCategories_category",
                        column: x => x.categoryId,
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_noteCategories_note",
                        column: x => x.noteId,
                        principalTable: "notes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "taskCategories",
                columns: table => new
                {
                    taskItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    categoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_taskCategories", x => new { x.taskItemId, x.categoryId });
                    table.ForeignKey(
                        name: "fk_taskCategories_category",
                        column: x => x.categoryId,
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_taskCategories_task",
                        column: x => x.taskItemId,
                        principalTable: "tareas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_categories_userId",
                table: "categories",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "uq_usuario_fecha",
                table: "dias",
                columns: new[] { "usuarioId", "fecha" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_noteCategories_categoryId",
                table: "noteCategories",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_notes_userId",
                table: "notes",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_tareas_diaId",
                table: "tareas",
                column: "diaId");

            migrationBuilder.CreateIndex(
                name: "IX_taskCategories_categoryId",
                table: "taskCategories",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "UQ__usuarios__AB6E6164889DB4AD",
                table: "usuarios",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "noteCategories");

            migrationBuilder.DropTable(
                name: "taskCategories");

            migrationBuilder.DropTable(
                name: "notes");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "tareas");

            migrationBuilder.DropTable(
                name: "dias");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
