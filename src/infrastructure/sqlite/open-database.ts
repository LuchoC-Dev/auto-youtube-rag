import { DatabaseSync } from "node:sqlite";

import {
  initialMigrationSql,
  initialSchemaVersion,
} from "./migrations/001-initial.js";

export type SQLiteMigrationErrorCode =
  "INCOMPATIBLE_SCHEMA_VERSION" | "MIGRATION_FAILED" | "UNVERSIONED_SCHEMA";

export class SQLiteMigrationError extends Error {
  public readonly code: SQLiteMigrationErrorCode;

  public constructor(
    code: SQLiteMigrationErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SQLiteMigrationError";
    this.code = code;
  }
}

interface SchemaVersionRow {
  readonly value: string;
}

function hasSchemaMeta(database: DatabaseSync): boolean {
  return (
    database
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_meta'",
      )
      .get() !== undefined
  );
}

function userSchemaObjects(database: DatabaseSync): readonly unknown[] {
  return database
    .prepare(
      "SELECT name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY name",
    )
    .all();
}

function migrateEmptyDatabase(database: DatabaseSync): void {
  database.exec("BEGIN IMMEDIATE");
  try {
    database.exec(initialMigrationSql);
    database.exec("COMMIT");
  } catch (error: unknown) {
    database.exec("ROLLBACK");
    throw new SQLiteMigrationError(
      "MIGRATION_FAILED",
      "Could not create the initial SQLite schema.",
      { cause: error },
    );
  }
}

function assertCompatibleVersion(database: DatabaseSync): void {
  const row = database
    .prepare("SELECT value FROM schema_meta WHERE key = 'schema_version'")
    .get() as SchemaVersionRow | undefined;

  if (row?.value !== initialSchemaVersion) {
    throw new SQLiteMigrationError(
      "INCOMPATIBLE_SCHEMA_VERSION",
      `SQLite schema version ${row?.value ?? "missing"} is incompatible; expected ${initialSchemaVersion}.`,
    );
  }
}

export function openDatabase(path: string): DatabaseSync {
  const database = new DatabaseSync(path, {
    allowExtension: false,
    defensive: true,
    enableDoubleQuotedStringLiterals: false,
    enableForeignKeyConstraints: true,
    timeout: 5_000,
  });

  try {
    database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
    database.prepare("PRAGMA journal_mode = WAL").get();

    if (!hasSchemaMeta(database)) {
      if (userSchemaObjects(database).length > 0) {
        throw new SQLiteMigrationError(
          "UNVERSIONED_SCHEMA",
          "Refusing to migrate a non-empty SQLite database without schema metadata.",
        );
      }
      migrateEmptyDatabase(database);
    }

    assertCompatibleVersion(database);
    return database;
  } catch (error: unknown) {
    database.close();
    throw error;
  }
}
