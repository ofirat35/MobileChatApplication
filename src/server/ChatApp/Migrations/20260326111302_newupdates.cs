using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class newupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "UserImages",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Swipes",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "CreateDate",
                table: "Memberships",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "MatchedAt",
                table: "Matches",
                newName: "CreatedDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Preferences",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "Preferences",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "Preferences");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "UserImages",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Swipes",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Memberships",
                newName: "CreateDate");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Matches",
                newName: "MatchedAt");
        }
    }
}
