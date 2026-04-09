using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class intup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ToUserId",
                table: "Matches",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FromUserId",
                table: "Matches",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_FromUserId",
                table: "Matches",
                column: "FromUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ToUserId",
                table: "Matches",
                column: "ToUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_AppUsers_FromUserId",
                table: "Matches",
                column: "FromUserId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_AppUsers_ToUserId",
                table: "Matches",
                column: "ToUserId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_AppUsers_FromUserId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_AppUsers_ToUserId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_FromUserId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_ToUserId",
                table: "Matches");

            migrationBuilder.AlterColumn<string>(
                name: "ToUserId",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "FromUserId",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
